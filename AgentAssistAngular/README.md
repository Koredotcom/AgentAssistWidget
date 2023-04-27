# AgentAssistWidget

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## How To Run the SDK application in the local environment
- Pre-requirements:
    - node version - 14.20.1^
- Backend:
    1. Open AgentDesktop latest code base navigate to ----> workflow.services.ts
    2. In that file find the method ----> resolveAgentAssistHostUrl()
    3. Add ----> if(url === 'http://localhost') return 'http://localhost/koreagentassist-sdk' <---- before return url
    4. Open AgentAssistAngular SDK project and navigate to template-render-class.service.ts
    5. Add this 'localhost' to the urls array as shown ----> urls: ['localhost']
    6. npm install in this path "AgentAssistAngular" folder path
    7. build the Angular project using the following command ----> node --max_old_space_size=6048 ./node_modules/@angular/cli/bin/ng build
    
- UI:
    1. Open AgentDesktop latest code base navigate to workflow.services.ts
    2. In that file find the method resolveAgentAssistHostUrl
    3. Add if(url === 'http://localhost:{{agentdesktop port number}}') return 'http://localhost/{{http-server port number}}' before return url
    4. Open AgentAssistAngular SDK project and navigate to template-render-class.service.ts
    5. Add this 'localhost' to the urls array as shown----> urls: ['localhost']
    6. npm install in this path "AgentAssistAngular" folder path
    7. run ----> ng serve --port 8080 <---- in this path "AgentAssistAngular" folder

```

