const databaseURL = 'https://swtor-calculator-72-6d693-default-rtdb.europe-west1.firebasedatabase.app'

export function create (data, storeName) {
  return fetch(`${databaseURL}/${storeName}.json`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
}

export function read (key, storeName) {
  return fetch(`${databaseURL}/${storeName}/${key}.json`)
    .then(res => res.json())
}
