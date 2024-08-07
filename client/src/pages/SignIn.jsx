import { Link, useNavigate } from "react-router-dom";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth.jsx";
import toast from "react-hot-toast";


export default function SignIn() {
  // Initialization
  const [formData, setFormData] = useState({})

  // Initial error and loading state
  const {loading, error: errorMessage} = useSelector(state => state.user);

  // Dispatch
  const dispatch = useDispatch();

  // Navigation
  const navigate = useNavigate();

  // getting data from input
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value.trim()});
  };

  //submit the data to the server
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page when submitting
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message);
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        toast.success("Signed in successfully");
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
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
          <p className="text-sm mt-5">This is a demo project. You can sign in with your email and password or with your google account</p>
        </div>
        {/* Right side */}
        <div className="flex-1 py-10 px-5 rounded-lg bg-slate-300 dark:bg-[#121212]">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              ) : ("Sign In")
              }
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

