Installation for express server creating for typescipt

npm init -y
npm i -D typescript
npx tsc --init
npm i express
npm i --save-dev @types/express
npm i -D typescript
then authomatic run to server add package.json file this command
npx tsx watch ./src/server.ts

then npm run ..

Request
↓
Route (URL)
↓
Controller (HTTP logic)
↓
Service (Business logic)
↓
Database

<!--  when user todo delete , then user also delete -->
