import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ToastHeader from "react-bootstrap/ToastHeader";

const SuccessAndFail = ({
  setSuccessShow,
  successShow,
  successMessage,
  setFailShow,
  failShow,
  errorMessage,
}) => {
  return (
    <>
      <ToastContainer position="top-center">
        <Toast
          className="mt-3"
          onClose={() => setSuccessShow(false)}
          bg="success"
          delay={3000}
          show={successShow}
          autohide
          style={{
            zIndex: "10000",
          }}
        >
          <ToastHeader closeButton={false}>
            <div className="text-center w-100">{successMessage}</div>
          </ToastHeader>
        </Toast>
      </ToastContainer>

      <ToastContainer position="top-center">
        <Toast
          className="mt-3"
          onClose={() => setFailShow(false)}
          bg="Danger"
          delay={3000}
          show={failShow}
          autohide
          style={{
            zIndex: "10000",
          }}
        >
          <ToastHeader closeButton={false}>
            <div className="text-center w-100">{errorMessage}</div>
          </ToastHeader>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default SuccessAndFail;
