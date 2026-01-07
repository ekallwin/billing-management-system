import { Edit2 } from 'lucide-react';
import { FaGooglePay } from "react-icons/fa";

const UPISettings = ({ settings, setSettings, editMode, setEditMode, handleSave }) => {
    return (
        <div className="glass card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FaGooglePay size={20} className="text-primary" />
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>UPI Settings</h4>
                </div>
                {!editMode.upi ? (
                    <button className="btn" onClick={() => setEditMode({ ...editMode, upi: true })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <Edit2 size={14} /> Edit
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleSave('UPI ID')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            Save
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => setEditMode({ ...editMode, upi: false })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>UPI ID</label>
                    <input
                        className="input-field"
                        placeholder="example@upi"
                        value={settings.upiId}
                        onChange={(e) => setSettings({ ...settings, upiId: e.target.value.toLowerCase() })}
                        disabled={!editMode.upi}
                        style={{ width: '100%', background: !editMode.upi ? 'var(--bg-main)' : 'var(--bg-secondary)', opacity: !editMode.upi ? 0.7 : 1 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>MERCHANT NAME</label>
                    <input
                        className="input-field"
                        placeholder="e.g. My Cafe"
                        value={settings.merchantName}
                        onChange={(e) => setSettings({ ...settings, merchantName: e.target.value })}
                        disabled={!editMode.upi}
                        style={{ width: '100%', background: !editMode.upi ? 'var(--bg-main)' : 'var(--bg-secondary)', opacity: !editMode.upi ? 0.7 : 1 }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>TRANSACTION NAME</label>
                    <input
                        className="input-field"
                        placeholder="e.g. Payment for My Cafe"
                        value={settings.transactionName}
                        onChange={(e) => setSettings({ ...settings, transactionName: e.target.value })}
                        disabled={!editMode.upi}
                        style={{ width: '100%', background: !editMode.upi ? 'var(--bg-main)' : 'var(--bg-secondary)', opacity: !editMode.upi ? 0.7 : 1 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UPISettings;
