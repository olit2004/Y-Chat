function ModalWrapper({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-opacity duration-300 ${
        open ? "opacity-100 bg-black/50 visible" : "opacity-0 invisible"
      } z-40`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl w-[500px] max-h-[80vh]  overflow-hidden flex flex-col" 
      >
        {children}
      </div>
    </div>
  );
}

export default ModalWrapper;