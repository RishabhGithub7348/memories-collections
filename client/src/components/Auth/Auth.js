import React,{useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from  './Input';
import Icon from './Icon';
import { signin, signup } from '../../actions/auth';
import { useDispatch } from 'react-redux';

const Auth = () => {

    const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
    
    const history = useHistory();
    const [isSignup, setIsSignup] = useState(false);
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();


    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (isSignup) {
        dispatch(signup(formData, history));
      } else {
        dispatch(signin(formData, history));
      }
    };
    const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value }); 
    }
      const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
      setFormData(initialState);
      setIsSignup((prevIsSignup) => !prevIsSignup);
      setShowPassword(false);
    }
    
   
  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
     try{
          dispatch({ type: 'AUTH' ,data: {result, token}})
          history.push('/')
       
     }catch (error) {
       console.log(error);
     }
  };

  const googleError = () => alert('Google Sign In was unsuccessful. Try again later');

    
  return (
    <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
         <Avatar className={classes.avatar}>
             <LockOutlinedIcon />
         </Avatar>
         <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
         <form className={classes.form} onSubmit={handleSubmit} >
             <Grid container spacing={2}>
              {
                isSignup && (
                  <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} half /> 
                  
                  <Input name="LastName" label="Last Name" handleChange={handleChange} half />
                  </>
                )
              }
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            clientId= "106713260478-vuj6v8h4qgehtlsdetlalsihmkm4pvss.apps.googleusercontent.com"
            render= {(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy={'single_host_origin'}
          />
          
          <Grid container justify = "flex-end">
         
         <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
          </Button>
         
          </Grid>
            
         </form>
        </Paper>
    </Container>
  )
}

export default Auth
