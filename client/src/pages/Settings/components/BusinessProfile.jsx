import { User, Edit2, Key } from 'lucide-react';

const BusinessProfile = ({ settings, setSettings, editMode, setEditMode, handleSave, onOpenPasswordModal }) => {
    return (
        <div className="glass card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User size={20} className="text-primary" />
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Business Profile</h4>
                </div>
                {!editMode.profile ? (
                    <button className="btn" onClick={() => setEditMode({ ...editMode, profile: true })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                        <Edit2 size={14} /> Edit
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleSave('Business Profile')} style={{ fontSize: '0.75rem' }}>
                            Save
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => setEditMode({ ...editMode, profile: false })} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>BUSINESS NAME</label>
                    <input
                        className="input-field"
                        placeholder="e.g. My Awesome Cafe"
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        disabled={!editMode.profile}
                        style={{ background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>ADDRESS</label>
                    <textarea
                        className="input-field"
                        placeholder="Full business address"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        disabled={!editMode.profile}
                        style={{ background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)', resize: 'none', height: '120px' }}
                    />
                </div>
                <div className="profile-grid">
                    <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>PHONE</label>
                        <input
                            className="input-field"
                            placeholder="10 digit number"
                            value={settings.phone}
                            type="tel"
                            inputMode="numeric"
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setSettings({ ...settings, phone: val });
                            }}
                            disabled={!editMode.profile}
                            style={{
                                background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)',
                                borderColor: (editMode.profile && settings.phone && settings.phone.length !== 10) ? 'var(--danger)' : 'var(--border-color)'
                            }}
                        />
                        {editMode.profile && settings.phone && settings.phone.length !== 10 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--danger)', marginTop: '0.2rem', display: 'block' }}>Invalid: Must be 10 digits</span>
                        )}
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>EMAIL</label>
                        <input
                            className="input-field"
                            placeholder="Email address"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            disabled={!editMode.profile}
                            style={{ background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                        />
                    </div>
                </div>
                <div className="profile-grid">
                    <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>GST NUMBER</label>
                        <input
                            className="input-field"
                            placeholder="GSTIN"
                            value={settings.gstNumber}
                            onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                            disabled={!editMode.profile}
                            style={{ background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>FSSAI</label>
                        <input
                            className="input-field"
                            placeholder="FSSAI License No."
                            value={settings.fssai}
                            onChange={(e) => setSettings({ ...settings, fssai: e.target.value })}
                            disabled={!editMode.profile}
                            style={{ background: !editMode.profile ? 'var(--bg-main)' : 'var(--bg-secondary)' }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button
                        className="btn"
                        onClick={onOpenPasswordModal}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', padding: '0.5rem 0.9rem', fontSize: '0.85rem', outline: '1px solid var(--primary)' }}
                    >
                        <Key size={16} /> Account Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
