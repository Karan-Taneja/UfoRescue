const setItem = (keyName, keyValue) => {
  if(typeof keyName !== 'string') {
    console.log('Key name must be a string');
  } else {
    localStorage.setItem(keyName, JSON.stringify(keyValue));
    if(localStorage.getItem(keyName)){
      console.log(`Successfully set item ${keyName}`);
    } else {
      console.log('Error occured while setting item');
    };
  };
};

const getItem = (keyName) => {
  if(typeof keyName !== 'string') {
    console.log('Key name must be a string');
  } else {
    let value = JSON.parse(localStorage.getItem(keyName));
    if(value) {
      console.log(`Key ${keyName} found, returning value`);
      return value;
    }
    else console.log(`Item ${keyName} does not exist`);
  };
};

const removeItem = (keyName) => {
  if(typeof keyName !== 'string') {
    console.log('Key name must be a string');
  } else {
    localStorage.removeItem(keyName);
    if(localStorage.getItem(keyName) === null){
      console.log(`Sucessfully removed item ${keyName}`);
    } else {
      console.log('Error occured while removing item');
    };
  };
};

export { setItem, getItem, removeItem };