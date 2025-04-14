# Code Citations

## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode:
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message:
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success")
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode =
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = status
```


## License: unknown
https://github.com/rishabh8n/collab-code/blob/c718bb8d1bfc4b9d1c126b65cb09ab89e81b77b8/server/src/utils/ApiResponse.ts

```
: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request,
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  
```


## License: MIT
https://github.com/tomascatena/discord-clone/blob/27f0c81477228d706fc7f20d9bef4de352cef94e/backend/src/utils/catchAsync.ts

```
(fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}
```

