import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Form } from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
const Toasts = () => {
    
    const notify = () => toast("Wow so easy!");

  return (

    <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
      </div>

  );
};

export default Toasts;