import { Edit2, Printer } from 'lucide-react';

const PrintSettings = ({ settings, setSettings, editMode, setEditMode, handleSave, onOpenPrinterInfo }) => {

    return (
        <div className="glass card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Printer size={20} className="text-primary" />
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Print settings</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure your printer type</p>
                        <p
                            onClick={onOpenPrinterInfo}
                            style={{
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.75rem',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            What is thermal printer?
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: editMode.print ? 'pointer' : 'default', opacity: editMode.print ? 1 : 0.7 }}>
                        <input
                            type="checkbox"
                            checked={settings.thermalPrint}
                            onChange={(e) => setSettings({ ...settings, thermalPrint: e.target.checked })}
                            style={{ width: '18px', height: '18px' }}
                            disabled={!editMode.print}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Thermal Printer Mode</span>
                    </label>

                    {!editMode.print ? (
                        <button className="btn" onClick={() => setEditMode({ ...editMode, print: true })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                            <Edit2 size={14} /> Edit
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" onClick={() => handleSave('Print Settings')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                Save
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => setEditMode({ ...editMode, print: false })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrintSettings;
