import React, { Component } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
export default class Profile extends Component {
 
 //Global variables(Depending upon isEdit value Add,Edit displayed)
 isEdit=false;
 data;
 username;
  constructor(props)
  {
    //Initialising state
    super(props);
    this.state={data:{
      username:'',
      email:'',
      phone:'',
      isEdit:false
    },
      details:[]
    }
    this.onhandle = this.onhandle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
this.onClick= this.onClick.bind(this);
  }
    
  componentDidMount(){
    axios.get('http://localhost:8081/profiles')
  .then( (response) => {
    console.log(response);
    this.setState({details:response["data"]})
  })
  .catch( (error) => {
    console.log(error);
  });
  }
  onSubmit(e){
  e.preventDefault();
  console.log(this.state);

    
  // if(this.showFormErrors()){
    console.log('shyam')
     axios.post('http://localhost:8081', this.state.data)
  .then( (response)=> {
    console.log(response);
     axios.get('http://localhost:8081/profiles')
  .then( (response) => {
    console.log(response);
    this.setState({details:response["data"]})
  })
  .catch( (error) => {
    console.log(error);
  });
  })
  .catch( (error) =>{
    console.log(error);
  });
  // }else{
  //   alert('Please enter Proper Details.')
  // }
   if(this.state.data.isEdit){
//   var isEdit = update(this.state.data,{isEdit:{$set:false}
//  }); 
 this.state={data:{
      username:'',
      email:'',
      phone:'',
      isEdit:false
    }}
// this.setState({data:isEdit});
}
}

 onhandle(e){
 this.data =  update(this.state.data, {
 [e.target.name]: {$set:e.target.value}
});
this.setState({data:this.data});
 // this.setState({data:{[e.target.name]:e.target.value}});

  this.showInputError(e.target.name);
}
onClick(event){
  console.log("hai");
  this.username  = event.data.username;
  console.log(event.data.username);
 var data= update(this.state.data, {
  username:{$set:event.data.username},
      email:{$set:event.data.email},
      phone:{$set:event.data.mobile},
      isEdit:{$set:true}
});
this.setState({data:data});
console.log(event);

}

showFormErrors() {
    const inputs = document.querySelectorAll('input');
    let isFormValid = true;
    
    inputs.forEach(input => {
      input.classList.add('active');
      
      const isInputValid = this.showInputError(input.name);
      
      if (!isInputValid) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }
   showInputError(refName) {
    const validity = this.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    const isEmail = refName === 'email';
    const isMobile = refName === 'phone';
    const isUsername = refName === 'username';
     if(isEmail){
            const emailVal = this.refs.email.value;
            const atpos = emailVal.indexOf("@");
            const dotpos = emailVal.lastIndexOf(".");
            if ((atpos<1 || dotpos<atpos+2 || dotpos+2>=emailVal.length) ) {
                this.refs.email.setCustomValidity('Not a valid e-mail address');
            }else{
                this.refs.email.setCustomValidity('');
            }
        } 
        if(isMobile){
          const phoneVal = this.refs.phone.value;

          var phoneno = /^\d{10}$/;
          if(!phoneVal.match(phoneno) ){
           
             this.refs.phone.setCustomValidity('Enter Valid Mobile Number.');
          }else{
                this.refs.phone.setCustomValidity('');
            }
        }
        if(isUsername){
          const usernameVal = this.refs.username.value;
          console.log(usernameVal.length);
          var regex = /^[a-zA-Z ]*$/;
          if(!usernameVal.match(regex)){
              console.log('jhgsukhti');
             this.refs.username.setCustomValidity('Enter Valid Username.');
          }
          else if(usernameVal.length <= 5){
                this.refs.username.setCustomValidity('Username should be more then 5 characters.');
            }else{
                this.refs.username.setCustomValidity('');
            }
        }
        // if(isPassword){
        //     const password = this.refs.pwd.value;
        //     if(password.length < 4 ){
        //         this.refs.pwd.setCustomValidity('Password Should be more than 4');
        //     }else{
        //         this.refs.pwd.setCustomValidity('');
        //     }
        // }
    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`; 
      } else if (isEmail && validity.customError) {
            error.textContent = 'Not a valid e-mail address';
           } 
          else if (isMobile && validity.customError) {
            error.textContent = 'Enter Valid Mobile Number.';
          }
       else if (isUsername && validity.customError) {
        error.textContent = 'Enter Valid Username.';
      }
      return false;
    }
    
    error.textContent = '';
    return true;
  }
  render() {
    return (
      <div className="profile">
        <div className="container">
        <div className="col-md-6 col-md-pull-1">
                <table className="table table-bordered">
                <thead>
                  <tr>
                      <th>S.NO</th>
                      <th>Name </th>
                      <th>Email</th>
                      <th>PhoneNumber</th>
                      <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {this.state.details.map((person, i) => <TableRow key = {i} data = {person} index={i} click={this.onClick} />)}
               
</tbody>
            </table>
       </div>
       
    
      <div className="col-md-6">
   {this.state.data.isEdit? <div><h1>Edit Profile</h1>
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
        <label className="control-label" id="usernameLabel">Username</label>
        <input type="text" onChange={this.onhandle} className="form-control" name="username" ref="username" value={this.username} readonly/>
        <div className="error" id="usernameError" />
        </div>
        
        <div className="form-group">
                                <label id="emailLabel">Email</label>
                                <input className="form-control" type="email" name="email" ref="email"
                                value={ this.state.data.email } onChange={ this.onhandle } required />
                                <div className="error" id="emailError" />
                            </div>
        <div className="form-group">
        <label className="control-label" id="phoneLabel">Phone</label>
        <input type="text" onChange={this.onhandle} className="form-control" name="phone" ref="phone"  value={this.state.data.phone}/>
        <div className="error" id="phoneError" />
        </div>
         <div className="form-group">
         <input type="submit" value="Update" />
         </div>
        </form> </div>                       :
   
  
<div>
<h1>Add Profile</h1>
       <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label className="control-label" id="usernameLabel">Username</label>
          <input type="text" onChange={this.onhandle} className="form-control" name="username" ref="username" value={this.state.data.username} required/>
          <div className="error" id="usernameError" />
        </div>
        
        <div className="form-group">
            <label id="emailLabel">Email</label>
            <input className="form-control" type="email" name="email" ref="email"
            value={ this.state.data.email } onChange={ this.onhandle } required />
            <div className="error" id="emailError" />
        </div>
        <div className="form-group">
          <label className="control-label" id="phoneLabel">Phone</label>
          <input type="text" onChange={this.onhandle} className="form-control" name="phone" ref="phone"  value={this.state.data.phone}/>
          <div className="error" id="phoneError" />
        </div>
         <div className="form-group">
          <input type="submit" value="Add" />
         </div>
        </form> 
</div>
}
      
      </div>
     </div>

      </div>
   
    )
  }
}
class TableRow extends React.Component {
   render() {
      return (
         <tr>
         <td>{this.props.index + 1}</td>
            <td>{this.props.data.username}</td>
            <td>{this.props.data.email}</td>
            <td>{this.props.data.mobile}</td>
            <td><span className="glyphicon glyphicon-edit" onClick = {()=>this.props.click(this.props)}></span></td>
         </tr>
      );
   }
}

