import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiInformationCircle } from 'react-icons/hi';


export default function SignUp() {
  // Initialization
  const [formData, setFormData] = useState({})

  // Initial error and loading state
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Navigation
  const navigate = useNavigate();

  // alert state
  const [alert, setAlert] = useState(false);

  // getting data from input
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value.trim()});
  };

  //submit the data to the server
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page when submitting
    if (!formData.username || !formData.email ||!formData.password) {
      return setErrorMessage("Please fill out all required fields")
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage("The username or email is incorrect")
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      setErrorMessage("The username or email is incorrect")
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left side */}
        <div className="flex-1">
          <Link to="/" className='text-4xl font-bold'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Elias's</span>
            Blog
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign up with your email and password or with your google account</p>
        </div>
        {/* Right side */}
        <div className="flex-1 border border-solid py-10 px-5 rounded-lg bg-slate-300">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                </>
              ) : ("Sign Up")
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-500">Sign In</Link>
          </div>
          {/* <>
            {alert && (
              <Alert className="mt-5" color="success" onDismiss={() => setAlert(false)}>
                <span className="font-medium">Success!</span> You have signed up successfully.
              </Alert>
            )}
          </> */}
          {errorMessage && (
            <Alert className="mt-5" color='failure' icon={HiInformationCircle} onDismiss={() => {
              setAlert(false)
              setErrorMessage(null)
            }}>
              <span className="font-medium">Failed!</span> {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}