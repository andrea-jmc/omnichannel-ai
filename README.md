# Enpoint de Whatsapp

# Estructura del proyecto

El proyecto tiene 4 carpetas principales:

- Routes: Preparan la información para procesarla
- Handlers: Hacen la mayoría del trabajo. Procesan y guardan la información
- Utils: Funciones adicionales que apoyan el flujo entre whatsapp, mongodb y el asistente IA
- Types: Interfaces de typescript

# Routes

Actualmente, existen 2 rutas:

- Webhooks: para eventos activados por mensajes del cliente
- Dashboard: para eventos activados por un agente desde el front end

## Webhooks [apiUrl]/webhooks

Para poder usar los webhooks de whatsapp, el servidor debe estar expuesto al internet

### Get /

Este es el llamado que usa whatsapp para conectar sus webhooks al endpoint. Este llamado solo se hace una vez cuando se configura whatsapp. Para una conexión exitosa, whatsapp debe mandar una petición que cumpla las siguientes condiciones en la query de request

- hub.mode debe ser “subscribe”
- hub.verify_token debe ser igual a la establecida en la configuración de whatsapp
- Debe contener el atributo hub.challenge

El endpoint debe regresar el valor de hub.challenge para configurar la conexión

### Post /

Este endpoint se llama **CADA VEZ QUE SE ACTUALIZA LA CONVERSACIÓN DE WHATSAPP**. Cuando el usuario manda un mensaje, el cuerpo del llamado al endpoint tiene un valor en req.body.entry[0].changes.value.messages. La primera entrada de este arreglo contiene el mensaje del usuario. Si el mensaje fue enviado a través del endpoint (por un agente o un asistente IA), el arreglo messages no tiene valor. En ese caso responde “OK” de inmediato, ya que la función [sendWhatsappMessage](#sendwhatsappmessage) (vista más adelante en este endpoint) está esperando este “OK”.

**IMPORTANTE**: Si el webhook de whatsapp no recibe una respuesta a tiempo, va a volver a llamar al endpoint hasta recibir un “OK”. Si el endpoint se tarda demasiado, se vuelve a llamar desde el webhook y se duplica el mensaje. Para evitar esto, el endpoint responde “OK” mientras está procesando los datos.

Actualmente el webhook soporta mensajes de texto, imágenes y documentos. Para procesar el mensaje, se crea el un objeto de tipo [IncomingMessage](#incomingmessage)

Este objeto se manda a la función [handleIncomingMessage](#handleincomingmessage) en handlers/main.ts

## Dashboard [apiUrl]/dashboard

### Get /

Retorna todos los chats. Llama a la función [handleOutgoingMessages](#handleoutgoingmessages)

### Post /

Se llama cuando el agente humano escribe un mensaje. Usa la función [handleAgentMessage](#handleagentmessage)

### Post /takeover

Cambia el valor de takeover para un chat. Cuando el valor de takeover se cambia a falso, se le envían al asistente todos los mensajes que se mandaron mientras el valor era verdadero. Usa la función [handleTakeover](#handletakeover)

### Post /close

Cambia el estado de la conversación a closed y elimina el threadId del chat en mongodb. Esto significa que se va a crear un thread nuevo la próxima vez que el usuario mande un mensaje. Usa la función [handleClose](#handleclose)

# Handlers

## main.ts

### `handleIncomingMessage: (IncomingMessage) => Promise<void>` {#handleincomingmessage}

Controla el flujo completo cuando el usuario envía un mensaje. Primero revisa si el mensaje incluye media (imagen o pdf). Si la incluye, la descarga del servidor de whatsapp y la sube a AWS. Luego guarda el contenido del mensaje en mongodb, revisa si existe un thread (conversación con asistente IA) conectado al chat. Si no existe crea uno. Luego, se agrega el mensaje al thread.  
Esta función usa setTimeout donde se revisa si el llamado actual a la función es el más reciente. El llamado más reciente envía todos los mensajes del thread al asistente al mismo tiempo, guarda la respuesta en mongodb y manda el mensaje al usuario. También revisa si es el mensaje final para guardar la data proporcionada por el usuario

Funciones llamadas desde handleIncomingMessage:

- [handleMedia](#handlemedia)
- [saveMessage](#savemessage)
- [getThread](#getthread)
- [updateThreadId](#updatethreadid)
- [stageAssistantPayload](#stageassistantpayload)
- [getLatestStagedMessage](#getlateststagedmessage)
- [runAssistant](#runassistant)
- [parseFinalMessage](#parsefinalmessage)
- [saveUser](#saveuser)
- [saveAssistantMessage](#saveassistantmessage)
- [sendWhatsappMessage](#sendwhatsappmessage)

### `handleMedia: (string) => Promise<{url: string, pdfUrls: string[]}>` {#handlemedia}

Se encarga de guardar imágenes o pdfs de whatsapp en S3. Un mensaje de whatsapp con media de cualquier tipo envía un id. Este ID se envía al endpoint de media de meta. Este endpoint retorna un url. Este url se usa para descargar el archivo en la forma de un string codificado. Si el archivo original es un pdf, se convierte en un arreglo de imágenes en la forma de strings codificados. Luego todos los strings codificados se suben a S3 y la función retorna todos los urls de S3. Solo el url del archivo original se guarda en el chat  
Funciones llamadas desde handleMeda:

- [getMediaUrl](#getmediaurl)
- [downloadMedia](#downloadmedia)
- [pdfToImage](#pdftoimage)
- [uploadMedia](#uploadmedia)

## mongo.ts

### `saveMessage: (IncomingMessage, string) => Promise<SaveMessageResponse()>`{#savemessage}

Revisa si existe una conversación con el id de whatsapp del usuario. Si no existe, crea un chat nuevo. Si existe, agrega el mensaje al chat. Retorna un objeto de tipo [SaveMessageResponse](#SaveMessageResponse). Para ver cómo se guarda el mensaje, ver el tipo [Conversation](#conversation)  
Funciones llamadas desde saveMessage

- [getMongoClientInstance](#getmongoclientinstance)

### `saveAssistantMessage: (string, string, boolean) => Promise<void>` {#saveassistantmessage}

Agrega el mensaje del asistente o agente humano al chat.  
Funciones llamadas desde saveAssistantMessage

- [getMongoClientInstance](#getmongoclientinstance)

### `updateThreadId: (string, string) => Promise<void>` {#updatethreadid}

Guarda el threadId en el chat  
Funciones llamadas desde updateThreadId:

- [getMongoClientInstance](#getmongoclientinstance)

### `saveUser: (User) => Promise<void>` {#saveuser}

Demo KYC: Guarda la [data del usuario](#user)
Funciones llamadas desde saveUser:

- [getMongoClientInstance](#getmongoclientinstance)

### `handleOutgoingMessages: () => Promise<OutgoingChat[]>`{#handleoutgoingmessages}

Retorna [todos los chats](#outgoingchat)
Funciones llamadas desde handleOutgoingMessages:

- [getMongoClientInstance](#getmongoclientinstance)
- [formatChatData](#formatchatdata)

### `handleAgentMessage: (AgentMessage) => Promise<void>` {#handleagentmessage}

Guarda el [mensaje del asistente](#agentmessage) en mongodb y envía el mensaje por whatsapp  
Funciones llamadas desde handleAgentMessage:

- [saveAssistantMessage](#saveassistantmessage)
- [sendWhatsappMessage](#sendwhatsappmessage)

### `handleTakeover: (TakeoverRequest) => Promise<void>` {#handletakeover}

[Actualiza el valor de takeover](#TakeoverRequest) en mongodb. Si el valor nuevo es falso, agrega todos los mensajes desde que se activó takeover al thread, los manda al asistente, guarda la respuesta y envía la respuesta al whatsapp del usuario  
Funciones llamadas desde handleTakeover:

- [getMongoClientInstance](#getmongoclientinstance)
- [stageMultipleMessages](#stagemultiplemessages)
- [runAssistant](#runassistant)
- [parseFinalMessage](#parsefinalmessage)
- [saveUser](#saveuser)
- [saveAssistantMessage](#saveassistantmessage)
- [sendWhatsappMessage](#sendwhatsappmessage)

### `getLatestStagedMessage: (string) => Promise<ConversationMessage>` {#getlateststagedmessage}

Retorna el [mensaje más reciente](#conversationmessage) en la conversación  
Funciones llamadas desde getLatestStagedMessage:

- [getMongoClientInstance](#getmongoclientinstance)

### `handleClose: (CloseRequest) => Promise <void>` {#handleclose}

Elimina el threadId del chat [con el userID indicado.](#closerequest)  
Funciones llamadas desde handleClose:

- [getMongoClientInstance](#getmongoclientinstance)

## axios.ts

### `getMediaUrl: (string) => Promise<{url: string, mime_type: string}>` {#getmediaurl}

Retorna el url de descarga y el tipo de un archivo subido por whatsapp

### `downloadMedia: (string) => Promise<ArrayBuffer>` {#downloadmedia}

Retorna el archivo original

## assistant.ts

### `stageAssistantPayload: (string, Thread, string, string[]) => Promise<void>` {#stageassistantpayload}

Agrega un mensaje al thread. Si el mensaje contiene una imagen, agrega el url de la imagen al mensaje. Si el mensaje contiene un pdf, agrega el url de la imagen de cada página al mensaje. La API de openai no tiene soporte de archivos, pero puede recibir imágenes a través de un url. Para mandar pdfs, se convierten en un arreglo de imágenes

### `runAssistant: (string) => Promise<string>` {#runassistant}

Manda todos los mensajes agregados en el thread al asistente. Retorna la respuesta del asistente.

### `getThread: (string) => Promise<Thread>` {#getthread}

Retorna el thread con el id proporcionado. Si no existe crea uno nuevo y lo retorna

### `stageMultipleMessages: (string, ConversationMessage[]) => Promise<void>` {#stagemultiplemessages}

Agrega una [lista de mensajes](#conversationmessage) al thread. Los mensajes del agente humano se agregan como si fueron enviados por el asistente IA

# Utils

## mongodb.ts

### `startMongoClient: () => Promise<void>`

Conecta la instancia del cliente de mongo a la base de datos

### `getMongoClientInstance: () => Promise<MongoClient> `{#getmongoclientinstance}

Retorna la instancia del cliente de mongo

### `stopMongoClient: () => Promise<void>`

Desconecta la instancia del cliente de mongo de la base de datos

### `formatChatData: (FindCursor<WithId<Conversation>>) => Promise<OutgoingChat[]>` {#formatchatdata}

Convierte [los chats de mongodb](#conversation) a un [formato para mostrar en el dashboard](#outgoingchat)

## whatsapp.ts

### `sendWhatsappMessage: (string, string) => Promise<AxiosResponse<any, any>>` {#sendwhatsappmessage}

Envía un mensaje al whatsapp del usuario. La respuesta de axios pasa por el webhook de whatsapp, lo que significa que conecta con el endpoint POST \- “/webhooks”. Para evitar problemas con recurrencia o mensajes repetidos, el endpoint responde “OK” inmediatamente si el mensaje viene del asistente IA o agente humano

## assistant.ts

### `parseFinalMessage: (string) => User | null` {#parsefinalmessage}

Busca palabras clave en el mensaje del asistente para determinar si este es el último mensaje del flujo. Si es el ultimo, crea un [objeto del usuario](#user)

## aws.ts

### `uploadMedia: ({Key: string, ContentType: string, Body: S3.PutObjectCommandInput.Body}) => Promise<string>` {#uploadmedia}

Guarda el archivo en S3 y retorna el url de AWS

## pdf-to-image.ts

### `pdfToImage: (string) => Promise<string[]>` {#pdftoimage}

Convierte el string codificado base64 de un pdf y retorna un arreglo de string codificado base64 de pngs

# Types

## main.d.ts

### IncomingMessage {#incomingmessage}

| Nombre    | Tipo           | Descripción                                   |
| :-------- | :------------- | :-------------------------------------------- |
| chatId    | string         | ID de la cuenta whatsapp business             |
| from      | string         | Whatsapp ID del usuario                       |
| messageID | string         | ID del mensaje actual                         |
| timestamp | string         | Unix timestamp. Fecha que se mandó el mensaje |
| content   | string         | Contenido de texto del mensaje                |
| mediaId   | string \| null | ID de la imagen o archivo                     |

### SaveMessageResponse {#savemessageresponse}

| Nombre   | Tipo    | Descripción                          |
| :------- | :------ | :----------------------------------- |
| takeover | boolean | El valor actual de takeover del chat |
| threadId | string  | ID del thread asignado al chat       |

### AgentMessage {#agentmessage}

| Nombre  | Tipo   | Descripción                       |
| :------ | :----- | :-------------------------------- |
| chat_id | string | ID de la cuenta whatsapp business |
| content | string | Contenido de texto del mensaje    |
| userId  | string | Whatsapp ID del usuario           |

### TakeoverRequest

| Nombre   | Tipo    | Descripción             |
| :------- | :------ | :---------------------- |
| takeover | boolean | Valor nuevo de takeover |
| userId   | string  | Whatsapp ID del usuario |

### CloseRequest {#closerequest}

| Nombre | Tipo   | Descripción             |
| :----- | :----- | :---------------------- |
| userId | string | Whatsapp ID del usuario |

## schemas.d.ts

### Conversation {#conversation}

| Nombre              | Tipo                                           | Descripción                               |
| :------------------ | :--------------------------------------------- | :---------------------------------------- |
| chat_id             | string                                         | ID de la cuenta whatsapp business         |
| thread_id           | string                                         | ID de la conversación con el asistente IA |
| user_id             | string                                         | Whatsapp ID del usuario                   |
| takeover            | boolean                                        | Indica si un agente humano está chateando |
| assigned_agent_id\* | string \| null                                 | ID del agente humano                      |
| messages            | [ConversationMessage](#conversationmessage)[ ] | Mensajes del chat                         |
| created_at          | Date                                           | Fecha de creación del chat                |
| updated_at          | Date                                           | Fecha de última actualización             |

\*assigned_agent_id no se usa en la implementación actual

### ConversationMessage {#conversationmessage}

| Nombre    | Tipo                             | Descripción                                  |
| :-------- | :------------------------------- | :------------------------------------------- |
| timestamp | string (Unix timestamp)          | Fecha que se envió el mensaje                |
| author    | “user” \| “assistant” \| “agent” | Origen del mensaje                           |
| content   | string                           | Contenido de texto                           |
| media     | string \| undefined              | URL de AWS con la imagen o documento         |
| takeover  | boolean                          | Valor de takeover cuando se envió el mensaje |

### User {#user}

| Nombre | Tipo   | Descripción     |
| :----- | :----- | :-------------- |
| name   | string | Nombre completo |
| id     | string | DNI             |
| phone  | string | Teléfono        |
| email  | string | Correo          |

### OutgoingChat {#outgoingchat}

| Nombre      | Tipo                                           | Descripción                               |
| :---------- | :--------------------------------------------- | :---------------------------------------- |
| chat_id     | string                                         | ID de la cuenta whatsapp business         |
| userId      | string                                         | Whatsapp ID del usuario                   |
| takeover    | boolean                                        | Indica si un agente humano está chateando |
| messages    | [ConversationMessage](#conversationmessage)[ ] | Mensajes del chat                         |
| lastMessage | string                                         | Mensaje más reciente                      |
