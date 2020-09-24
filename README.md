# Fetch
An abstraction to JS async/await fetch() requests to standardize the response format

While working on a large project with many async/await fetch() requests, I wanted to eliminate all of the extraneous code from each request. All of my requests followed the same format:

```javascript

async function saveValueToServer() {
  const request = await fetch(someRoute, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/x-www-form-urlencoded',
    },
    body: 'data=somevalue',
  });
  return await request.json()
}
```

I would either then handle the returned values inside of each custom function, or return that function and handle the response in an external .then() call. This __Fetch__ class is an attempt to follow the DRY principle and create more readable code in the process. 

## Usage

Usage of the Fetch request should be dead simple

> GET Request
```typescript
Fetch.get('thisismyroute').then((response) => {
  // regardless of the request, response returns an object with two properties
  // status and data. Data is your server response. Status is decided and set
  // in the handleFetchResponse() method in the /Lib/Lib.ts file
  if (response.status === 'success') {
    // handle successful response
    console.log(response.data);
  } else {
    console.error('There was an error');
  }
})
```

> POST Request
```typescript
Fetch.store('thisIsAPostRoute', {id: 5, state: 'active'}).then((repsonse) => {
  if (response.status === 'success') {
    //handle successful response
    console.log(response.data);
  } else {
    console.error('There was an error');
  }
})
```
> PUT Request
```typescript
Fetch.update('thisIsAPutRoute', {id: 5, state: 'inactive'}).then((repsonse) => {
  if (response.status === 'success') {
    //handle successful response
    console.log(response.data);
  } else {
    console.error('There was an error');
  }
})
```
> DELETE Request
```typescript
const id = 5
Fetch.destroy(`thisIsADeleteRoute/{$id}`).then((repsonse) => {
  if (response.status === 'success') {
    //handle successful response
    console.log(response.data);
  } else {
    console.error('There was an error');
  }
})
```
## Errors

When the response is not the right format, i.e., it expects JSON, but receives text or HTML, the handleFetchResponse sets the status prop to 'error' and automatically puts out a console.error() with the server response. 

### Extended Usage

What I ended up doing, due to the scope of the project and the number of self contained modules in the project, was creating an Action class in each module. The Action class would act as a container for static methods that would then return the Fetch response.

```typescript
export class Action {
  public async static loadValuesById(id: number) {
    return Fetch.get(`theRouteToValues/${id}`);
  }
}
```

This allowed me to contain all of my Fetch requests in one place for each module, rather than scattered all over the codebase. Is it a good solution? Some probably don't think so, but it was very helpful for this project. I don't think it's exactly an anti-pattern, but the alternative was having many Fetch calls scattered around the modules. The added bonus of using this pattern, all of my routes for the given module were in one place and if any other module on the site needed to access that route, I wouldn't need to write another Fetch() request, I would just import the proper Action class and use the already existing method. 

```typescript
// Using this pattern, I can just call Action.loadValuesById(1) from anywhere, with the 
// proper imports, and then handle the response with the same .then() as the Fetch calls

import { Action } from '../Action/Action.js';

Action.loadValuesById(1).then((response) => {
  if (response.status === 'success') {
    // handle successful response
  } else {
    console.error('There was an error');
  }
});

```
