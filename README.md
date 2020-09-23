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

I would either then handle the returned values inside of each custom function, or return that function and handle the response in an external .then() call. This __Fetch__ class is attempt to follow the DRY principle and create more readable code in the process. 

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
    console.log(response.data)'
  } else {
    console.error('There was an error');
  }
})
```

> POST Request
```typescript
Fetch.store('thisisapostroute', {id: 5, state: 'active'}).then((repsonse) => {
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
