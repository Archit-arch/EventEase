const Login = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <form className="flex flex-col">
          <input type="text" placeholder="Username" className="p-2 border mb-2" />
          <input type="password" placeholder="Password" className="p-2 border mb-2" />
          <button className="bg-blue-500 text-white p-2">Login</button>
        </form>
      </div>
    );
  };
  
  export default Login;
  