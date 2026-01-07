import { Edit2 } from 'lucide-react';
import { TbTax } from "react-icons/tb";

const TaxSettings = ({ settings, setSettings, editMode, setEditMode, handleSave }) => {
    return (
        <div className="glass card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TbTax size={20} className="text-primary" />
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Tax Settings</h4>
                </div>
                {!editMode.tax ? (
                    <button className="btn" onClick={() => setEditMode({ ...editMode, tax: true })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <Edit2 size={14} /> Edit
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleSave('Tax Settings')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            Save
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => setEditMode({ ...editMode, tax: false })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                    <label className="switch" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: editMode.tax ? 'pointer' : 'default', opacity: editMode.tax ? 1 : 0.7 }}>
                        <input
                            type="checkbox"
                            checked={settings.taxEnabled}
                            onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })}
                            style={{ width: '18px', height: '18px' }}
                            disabled={!editMode.tax}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Enable Tax</span>
                    </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: (settings.taxEnabled && editMode.tax) ? 1 : 0.5, pointerEvents: (settings.taxEnabled && editMode.tax) ? 'auto' : 'none' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>TAX NAME</label>
                        <input
                            className="input-field"
                            placeholder="e.g. GST"
                            value={settings.taxName}
                            onChange={(e) => setSettings({ ...settings, taxName: e.target.value })}
                            disabled={!editMode.tax || !settings.taxEnabled}
                            style={{ background: (!editMode.tax || !settings.taxEnabled) ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>PERCENT (%)</label>
                        <input
                            className="input-field"
                            type="number"
                            inputMode="numeric"
                            placeholder=""
                            value={settings.taxPercent}
                            onChange={(e) => setSettings({ ...settings, taxPercent: e.target.value })}
                            disabled={!editMode.tax || !settings.taxEnabled}
                            style={{ background: (!editMode.tax || !settings.taxEnabled) ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxSettings;
