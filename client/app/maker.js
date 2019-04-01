const handleDomo = (e) =>{
  e.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLives").val() == ''){//|| $("#domoLives").val() == ''){
    handleError("RAWR! All fields are required");
    return false;
  }
  
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
    

    const csrf = document.querySelector('#domoForm').querySelector('#csrfToken').value;
    
    loadDomosFromServer(csrf);
  });
  
  return false;
};

const DomoForm = (props) =>{
  return(
  <form id="domoForm" name="domoForm"
        onSubmit={handleDomo}
        action="/maker"
        method='POST'
        className="domoForm"
    >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name" />
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
    <label htmlFor="lives">Lives: </label>
    <input id="domoLives" type="text" name="lives" placeholder="Domo Lives" />
    <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />
    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
  </form>
  );
};

const DomoList = function(props){
  if(props.domos.length === 0){
    return(
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo){
    return(
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>     
        <h3 className="domoLives">Lives: {domo.lives}</h3>   
      </div>
    );
  });
  
  return(
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = (csrf) =>{
  sendAjax('GET', '/getDomos', null, (data) =>{
    ReactDOM.render(
      <DomoList csrf={csrf} domos={data.domos} />,
      document.querySelector("#domos")
    );
  });
};

const setup = function(csrf){
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector("#makeDomo")
  );
  
  ReactDOM.render(
    <DomoList csrf={csrf} domos={[]} />,
    document.querySelector("#domos")
  ); 
  loadDomosFromServer(csrf);
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) =>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});