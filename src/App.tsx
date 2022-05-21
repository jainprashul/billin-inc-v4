import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './styles/App.css';
import { defaultUser, testDB } from './services/database/testDB';
import { useLiveQuery } from 'dexie-react-hooks';
import db from './services/database/db';
import { User } from './services/database/model/User';
import faker from '@faker-js/faker';

function App() {
  const q = useLiveQuery( async ()=> db.users.toArray(), [db.users]);

  const createUser = () => {
    const user = new User({
      name: faker.name.findName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      roleID: 2,
      password: faker.internet.password(8),
      companyIDs: [1]
  });
    console.log(user);
    
    user.save();
  }

  return (
    <div className="App">
      Test DB 
      <button onClick={createUser}>Create User</button>
      {q?.map(user => <div key={user.id}> {user.username}, {user.email} 
       <button onClick={() => user.delete()}>Delete</button>
       </div>)}    
    </div>
  );
}

export default App;
