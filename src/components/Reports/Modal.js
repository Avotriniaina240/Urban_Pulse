import '../styles/ATS/AnalyzeReports.css';
const Modal = ({ isOpen, onClose, reportDetails }) => {
    if (!isOpen || !reportDetails) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>X</button>
          <h2>Détails du Rapport</h2>
          <p><strong>Description:</strong> {reportDetails.description}</p>
          <p><strong>Lieu:</strong> {reportDetails.location}</p>
          <p><strong>Statut:</strong> {reportDetails.status}</p>
        </div>
      </div>
    );
  };
  
  export default Modal;