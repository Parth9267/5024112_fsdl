import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
const API = 'http://localhost:5000';
const categoryColors = { 'e-waste':'danger','plastic':'primary','metal':'secondary','paper':'warning','other':'dark' };

export default function Dashboard({ user, activeView, setActiveView }) {
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({ title:'', category:'plastic', weight:'', city:'', imageUrl:'' });
  const [chatBox, setChatBox] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [offerAmounts, setOfferAmounts] = useState({});
  const [proofPhotos, setProofPhotos] = useState({});
  const [proofPreviews, setProofPreviews] = useState({});

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchListings = async () => {
    try { const { data } = await axios.get(`${API}/api/listings`); setListings(data); }
    catch(e) { console.error('Failed to load listings'); }
  };

  useEffect(() => { fetchListings(); }, []);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      if (chatBox && chatBox.listingId === message.listing)
        setChatBox(prev => ({ ...prev, messages: [...prev.messages, message] }));
    });
    return () => socket.off('receive_message');
  }, [chatBox]);

  const co2Saved = () => {
    const m = { 'e-waste':2,'plastic':1.5,'metal':1.2,'paper':0.9,'other':0.5 };
    return listings.filter(l=>l.status==='completed').reduce((t,l)=>t+(l.weight*(m[l.category]||0.5)),0).toFixed(1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file){ const r=new FileReader(); r.onloadend=()=>setNewListing({...newListing,imageUrl:r.result}); r.readAsDataURL(file); }
  };

  const handleProofUpload = (listingId, e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(f => new Promise(res => { const r=new FileReader(); r.onloadend=()=>res(r.result); r.readAsDataURL(f); }));
    Promise.all(readers).then(results => {
      setProofPhotos(p => ({...p, [listingId]: [...(p[listingId]||[]), ...results]}));
      setProofPreviews(p => ({...p, [listingId]: [...(p[listingId]||[]), ...results]}));
    });
  };

  const handleMakeOffer = async (id) => {
    const amount = offerAmounts[id];
    if(!amount) return alert('Enter an offer amount');
    try { await axios.post(`${API}/api/listings/${id}/offer`,{amount:Number(amount)},config); alert('Offer submitted!'); fetchListings(); }
    catch(e){ alert(e.response?.data?.message||'Error'); }
  };

  const handleAcceptOffer = async (lid, oid) => {
    try { await axios.put(`${API}/api/listings/${lid}/offer/${oid}/accept`,{},config); alert('Offer accepted!'); fetchListings(); }
    catch(e){ alert(e.response?.data?.message||'Error'); }
  };

  const handleComplete = async (id) => {
    try {
      const photos = proofPhotos[id] || [];
      await axios.put(`${API}/api/listings/${id}/complete`, { proofPhotos: photos }, config);
      alert('Listing completed!'); setProofPhotos(p=>({...p,[id]:undefined})); setProofPreviews(p=>({...p,[id]:undefined})); fetchListings();
    } catch(e){ alert(e.response?.data?.message||'Error'); }
  };

  const handleRateUser = async (uid, rating) => {
    try { await axios.post(`${API}/api/users/${uid}/rate`,{rating},config); alert('Rating submitted!'); fetchListings(); }
    catch(e){ alert(e.response?.data?.message||'Error'); }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try { await axios.post(`${API}/api/listings`,newListing,config); setNewListing({title:'',category:'plastic',weight:'',city:'',imageUrl:''}); fetchListings(); }
    catch(e){ alert(e.response?.data?.message||'Error'); }
  };

  const openChat = (listing) => { setChatBox({listingId:listing._id,seller:listing.seller,messages:[]}); socket.emit('join_room',listing._id); };
  const sendMessage = () => {
    if(!currentMessage.trim()) return;
    const msg = {sender:user._id,receiver:chatBox.seller._id||chatBox.seller,listing:chatBox.listingId,content:currentMessage};
    socket.emit('send_message',msg); setChatBox(p=>({...p,messages:[...p.messages,{...msg,sender:user._id}]})); setCurrentMessage('');
  };

  const filtered = listings.filter(l => {
    const mc = filter==='all'||l.category===filter;
    const mci = !cityFilter||(l.city&&l.city.toLowerCase().includes(cityFilter.toLowerCase()));
    return mc && mci;
  });

  const myListings = listings.filter(l => l.seller?._id === user._id || l.buyer === user._id);
  const myOffers = listings.filter(l => l.offers?.some(o => o.buyer === user._id || o.buyerName === user.name));
  const completedList = listings.filter(l => l.status === 'completed');
  const activeCount = listings.filter(l=>l.status==='active').length;
  const completedCount = completedList.length;

  // Mumbai locations for city dropdown
  const mumbaiAreas = ['Andheri West','Andheri East','Bandra West','Bandra East','Dadar','Borivali West','Borivali East','Malad West','Goregaon West','Powai','Vikhroli','Ghatkopar','Mulund','Kurla','Chembur','Sion','Worli','Lower Parel','Colaba','Navi Mumbai','Vashi','Thane West','Thane East','Dombivli','Kalyan','Mira Road','Panvel','Kharghar'];

  const renderListingCard = (item) => (
    <div key={item._id} className="col-sm-6 col-lg-4 col-xl-3">
      <div className="card h-100 border-0 overflow-hidden">
        {item.imageUrl && <div style={{height:'140px',overflow:'hidden'}}><img src={item.imageUrl} alt="scrap" style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>}
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`badge bg-${categoryColors[item.category]||'dark'} bg-opacity-10 text-${categoryColors[item.category]||'dark'} border border-${categoryColors[item.category]||'dark'} badge-category`}>{item.category}</span>
            <span className={`status-indicator status-${item.status}`}><span className="status-dot"></span><span className="text-capitalize text-muted">{item.status}</span></span>
          </div>
          <h5 className="card-title fw-bold text-dark mb-3">{item.title}</h5>
          <div className="bg-light rounded p-3 mb-3">
            <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Location</span><span className="fw-semibold small">📍 {item.city||'Mumbai'}</span></div>
            <div className="d-flex justify-content-between mb-2"><span className="text-muted small">Seller</span><span className="fw-semibold small">{item.seller?.name||'Anonymous'}{item.seller?.averageRating>0&&<span className="ms-1 text-warning">★ {item.seller.averageRating.toFixed(1)}</span>}</span></div>
            <div className="d-flex justify-content-between"><span className="text-muted small">Weight</span><span className="fw-semibold small text-primary">{item.weight} kg</span></div>
          </div>
          {/* Proof photos display */}
          {item.proofPhotos && item.proofPhotos.length > 0 && item.status === 'completed' && (
            <div className="mb-3"><span className="small text-muted fw-semibold">📸 Proof Photos:</span>
              <div className="d-flex gap-2 mt-2 flex-wrap">{item.proofPhotos.map((p,i)=><img key={i} src={p} alt="proof" className="proof-thumb" />)}</div>
            </div>
          )}
          {/* Seller: pending offers */}
          {user.role==='seller'&&user._id===item.seller?._id&&item.status==='active'&&item.offers?.length>0&&(
            <div className="mt-3"><h6 className="fw-bold small mb-2 text-muted">Received Offers:</h6>
              <div className="d-flex flex-column gap-2">{item.offers.filter(o=>o.status==='pending').map(o=>(
                <div key={o._id} className="d-flex justify-content-between align-items-center p-2 border rounded bg-white">
                  <span className="small fw-semibold">{o.buyerName}: <span className="text-success">₹{o.amount}</span></span>
                  <button onClick={()=>handleAcceptOffer(item._id,o._id)} className="btn btn-sm btn-success py-0 px-2 small">Accept</button>
                </div>
              ))}</div>
            </div>
          )}
        </div>
        <div className="card-footer bg-white border-0 p-4 pt-0 d-flex flex-column gap-2">
          {user.role==='buyer'&&item.status==='active'&&(
            <div className="d-flex gap-2 w-100">
              <input type="number" className="form-control form-control-sm" placeholder="Offer ₹" value={offerAmounts[item._id]||''} onChange={e=>setOfferAmounts({...offerAmounts,[item._id]:e.target.value})} />
              <button onClick={()=>handleMakeOffer(item._id)} className="btn btn-enterprise btn-sm fw-semibold flex-shrink-0">Submit Offer</button>
            </div>
          )}
          {user.role==='seller'&&item.status==='scheduled'&&item.seller?._id===user._id&&(
            <div className="proof-upload-section">
              <label className="form-label small fw-semibold text-muted mb-1">📸 Upload Proof Photos (required)</label>
              <input type="file" accept="image/*" multiple className="form-control form-control-sm mb-2" onChange={e=>handleProofUpload(item._id,e)} />
              {proofPreviews[item._id]&&proofPreviews[item._id].length>0&&(
                <div className="d-flex gap-2 mb-2 flex-wrap">{proofPreviews[item._id].map((p,i)=><img key={i} src={p} alt="proof" className="proof-thumb" />)}</div>
              )}
              <button onClick={()=>handleComplete(item._id)} className="btn btn-success w-100 btn-sm py-2 fw-semibold">✅ Complete with Proof</button>
            </div>
          )}
          {item.status==='completed'&&user.role==='buyer'&&item.buyer===user._id&&(
            <div className="d-flex flex-column align-items-center bg-light rounded p-2">
              <span className="small text-muted mb-1">Rate this seller</span>
              <div className="d-flex gap-1">{[1,2,3,4,5].map(s=><button key={s} onClick={()=>handleRateUser(item.seller._id,s)} className="btn btn-sm btn-outline-warning p-1 lh-1" style={{width:'28px',height:'28px'}}>★</button>)}</div>
            </div>
          )}
          <button onClick={()=>openChat(item)} className="btn btn-outline-secondary w-100 btn-sm py-2 fw-semibold mt-1">💬 Chat</button>
        </div>
      </div>
    </div>
  );

  // Metrics bar
  const MetricsBar = () => (
    <div className="row g-4 mb-5">
      <div className="col-md-3"><div className="card metric-card p-4"><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem',letterSpacing:'0.5px'}}>Active Listings</h6><h3 className="fw-bold mb-0 text-dark">{activeCount}</h3></div></div>
      <div className="col-md-3"><div className="card metric-card p-4" style={{borderTopColor:'#f59e0b'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem',letterSpacing:'0.5px'}}>Completed Pickups</h6><h3 className="fw-bold mb-0 text-dark">{completedCount}</h3></div></div>
      <div className="col-md-3"><div className="card metric-card p-4" style={{borderTopColor:'#10b981'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem',letterSpacing:'0.5px'}}>CO₂ Saved</h6><h3 className="fw-bold mb-0 text-success">{co2Saved()} kg</h3></div></div>
      <div className="col-md-3"><div className="card metric-card p-4" style={{borderTopColor:'#8b5cf6'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem',letterSpacing:'0.5px'}}>My Transactions</h6><h3 className="fw-bold mb-0 text-dark">{myListings.length}</h3></div></div>
    </div>
  );

  // View: Dashboard
  const DashboardView = () => (
    <>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div><h2 className="fw-bolder text-dark mb-1" style={{letterSpacing:'-0.5px'}}>Dashboard</h2><p className="text-muted mb-0">Overview of your recycling activities</p></div>
      </div>
      <MetricsBar />
      {user.role==='seller'&&(
        <div className="card mb-5 border-0" style={{background:'linear-gradient(to right,#ecfdf5,#f0fdfa)'}}>
          <div className="card-body p-4 p-md-5">
            <h5 className="card-title fw-bold text-dark mb-4 d-flex align-items-center gap-2"><span className="bg-white p-2 rounded-circle shadow-sm" style={{fontSize:'1.2rem'}}>📦</span> Post a New Listing</h5>
            <form onSubmit={handleCreateListing} className="row g-3 align-items-end">
              <div className="col-md-3"><label className="form-label text-muted fw-semibold" style={{fontSize:'0.85rem'}}>Title</label><input type="text" className="form-control bg-white" placeholder="e.g. Old Refrigerator" value={newListing.title} onChange={e=>setNewListing({...newListing,title:e.target.value})} required /></div>
              <div className="col-md-2"><label className="form-label text-muted fw-semibold" style={{fontSize:'0.85rem'}}>Category</label>
                <select className="form-select bg-white" value={newListing.category} onChange={e=>setNewListing({...newListing,category:e.target.value})}><option value="e-waste">E-Waste</option><option value="plastic">Plastic</option><option value="metal">Metal</option><option value="paper">Paper</option><option value="other">Other</option></select>
              </div>
              <div className="col-md-1"><label className="form-label text-muted fw-semibold" style={{fontSize:'0.85rem'}}>Weight</label><input type="number" className="form-control bg-white" placeholder="kg" value={newListing.weight} onChange={e=>setNewListing({...newListing,weight:e.target.value})} required /></div>
              <div className="col-md-2"><label className="form-label text-muted fw-semibold" style={{fontSize:'0.85rem'}}>Area (Mumbai)</label>
                <select className="form-select bg-white" value={newListing.city} onChange={e=>setNewListing({...newListing,city:e.target.value})} required>
                  <option value="">Select area...</option>{mumbaiAreas.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-md-2"><label className="form-label text-muted fw-semibold" style={{fontSize:'0.85rem'}}>Photo</label><input type="file" accept="image/*" className="form-control bg-white" onChange={handleImageUpload} /></div>
              <div className="col-md-2"><button type="submit" className="btn btn-enterprise w-100 py-2 fw-bold">Post Listing</button></div>
            </form>
          </div>
        </div>
      )}
      {/* Filter & listings */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h4 className="fw-bold mb-0 text-dark">Available Scrap</h4>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <input type="text" className="form-control form-control-sm rounded-pill px-3" placeholder="📍 Filter by area..." style={{width:'180px'}} value={cityFilter} onChange={e=>setCityFilter(e.target.value)} />
          <div className="d-flex gap-2 overflow-auto pb-2 pb-md-0" style={{scrollbarWidth:'none'}}>
            {['all','e-waste','plastic','metal','paper','other'].map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)} className={`btn btn-sm text-capitalize px-3 rounded-pill ${filter===cat?'btn-enterprise':'btn-outline-secondary bg-white'}`} style={{fontWeight:filter===cat?'600':'500'}}>{cat}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="row g-4 mb-5">
        {filtered.length===0&&(<div className="col-12 py-5 text-center"><div className="bg-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3 shadow-sm" style={{width:'80px',height:'80px'}}><span style={{fontSize:'2rem'}}>🗑️</span></div><h5 className="fw-bold text-dark mb-1">No listings found</h5><p className="text-muted">Adjust your filters or be the first to post!</p></div>)}
        {filtered.map(renderListingCard)}
      </div>
    </>
  );

  // View: My Listings
  const MyListingsView = () => (
    <>
      <h2 className="fw-bolder text-dark mb-1">My Listings</h2><p className="text-muted mb-4">All listings you've created or participated in</p>
      <div className="row g-4 mb-5">{myListings.length===0?<p className="text-muted text-center py-5">No listings found for your account.</p>:myListings.map(renderListingCard)}</div>
    </>
  );

  // View: Bidding
  const BiddingView = () => {
    const biddingListings = listings.filter(l => (l.offers&&l.offers.length>0) || (user.role==='seller'&&l.seller?._id===user._id&&l.offers?.length>0));
    return (<>
      <h2 className="fw-bolder text-dark mb-1">Bidding & Offers</h2><p className="text-muted mb-4">Track all your active bids and negotiations</p>
      <div className="row g-4 mb-5">{biddingListings.length===0?<p className="text-muted text-center py-5">No active bids found.</p>:biddingListings.map(renderListingCard)}</div>
    </>);
  };

  // View: Messages
  const MessagesView = () => (
    <>
      <h2 className="fw-bolder text-dark mb-1">Messages</h2><p className="text-muted mb-4">Your conversations with buyers and sellers</p>
      <div className="card p-5 text-center border-0"><span style={{fontSize:'3rem'}}>💬</span><h5 className="fw-bold mt-3">Click "Chat" on any listing to start a conversation</h5><p className="text-muted">Real-time messaging powered by Socket.IO</p><button onClick={()=>setActiveView('dashboard')} className="btn btn-enterprise mt-2">Browse Listings</button></div>
    </>
  );

  // View: Impact
  const ImpactView = () => {
    const cats = ['e-waste','plastic','metal','paper','other'];
    const m = {'e-waste':2,'plastic':1.5,'metal':1.2,'paper':0.9,'other':0.5};
    return (<>
      <h2 className="fw-bolder text-dark mb-1">🌍 Environmental Impact</h2><p className="text-muted mb-4">Your contribution to a greener planet</p>
      <div className="row g-4 mb-5">
        <div className="col-md-4"><div className="card metric-card p-4 text-center" style={{borderTopColor:'#10b981'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem'}}>Total CO₂ Saved</h6><h2 className="fw-bold text-success">{co2Saved()} kg</h2></div></div>
        <div className="col-md-4"><div className="card metric-card p-4 text-center" style={{borderTopColor:'#3b82f6'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem'}}>Total Weight Recycled</h6><h2 className="fw-bold text-primary">{completedList.reduce((t,l)=>t+l.weight,0).toFixed(1)} kg</h2></div></div>
        <div className="col-md-4"><div className="card metric-card p-4 text-center" style={{borderTopColor:'#f59e0b'}}><h6 className="text-muted text-uppercase fw-semibold mb-2" style={{fontSize:'0.8rem'}}>Transactions Done</h6><h2 className="fw-bold text-warning">{completedCount}</h2></div></div>
      </div>
      <h5 className="fw-bold mb-3">By Category</h5>
      <div className="row g-3">{cats.map(c=>{const items=completedList.filter(l=>l.category===c);const weight=items.reduce((t,l)=>t+l.weight,0);return(
        <div key={c} className="col-md-4"><div className="card p-3 border-0"><div className="d-flex justify-content-between"><span className="text-capitalize fw-semibold">{c}</span><span className="badge bg-success bg-opacity-10 text-success">{items.length} items</span></div><div className="mt-2"><small className="text-muted">{weight.toFixed(1)} kg → {(weight*(m[c]||0.5)).toFixed(1)} kg CO₂ saved</small><div className="progress mt-1" style={{height:'6px'}}><div className="progress-bar bg-success" style={{width:`${Math.min((weight/50)*100,100)}%`}}></div></div></div></div></div>
      )})}</div>
    </>);
  };

  // View: Profile
  const ProfileView = () => (
    <>
      <h2 className="fw-bolder text-dark mb-1">Profile & Ratings</h2><p className="text-muted mb-4">Your reputation and account details</p>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-4 border-0 text-center">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{width:'80px',height:'80px'}}><span style={{fontSize:'2.5rem'}}>👤</span></div>
            <h4 className="fw-bold">{user.name}</h4><p className="text-muted">{user.email}</p>
            <span className={`badge bg-${user.role==='seller'?'success':'primary'} bg-opacity-10 text-${user.role==='seller'?'success':'primary'} border border-${user.role==='seller'?'success':'primary'} text-capitalize mx-auto`} style={{fontSize:'0.85rem',padding:'0.5em 1.5em'}}>{user.role}</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 border-0"><h5 className="fw-bold mb-3">Activity Summary</h5>
            <div className="d-flex justify-content-between py-2 border-bottom"><span className="text-muted">Active Listings</span><span className="fw-bold">{activeCount}</span></div>
            <div className="d-flex justify-content-between py-2 border-bottom"><span className="text-muted">Completed</span><span className="fw-bold text-success">{completedCount}</span></div>
            <div className="d-flex justify-content-between py-2 border-bottom"><span className="text-muted">My Listings</span><span className="fw-bold">{myListings.length}</span></div>
            <div className="d-flex justify-content-between py-2"><span className="text-muted">CO₂ Saved</span><span className="fw-bold text-success">{co2Saved()} kg</span></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderView = () => {
    switch(activeView) {
      case 'listings': return <MyListingsView />;
      case 'bidding': return <BiddingView />;
      case 'messages': return <MessagesView />;
      case 'impact': return <ImpactView />;
      case 'profile': return <ProfileView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="container py-5">
      {renderView()}
      {/* Chat Widget */}
      {chatBox && (
        <div className="chat-window">
          <div className="chat-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2"><div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{width:'32px',height:'32px'}}><span style={{fontSize:'1rem'}}>💬</span></div><div><div className="lh-1">Live Chat</div><div className="fw-normal text-white-50" style={{fontSize:'0.75rem'}}>Listing Interaction</div></div></div>
            <button onClick={()=>setChatBox(null)} className="btn-close btn-close-white" style={{fontSize:'0.75rem'}} />
          </div>
          <div className="chat-messages">
            {chatBox.messages.length===0&&(<div className="text-center my-4"><span className="d-block mb-2" style={{fontSize:'2rem'}}>👋</span><p className="text-muted small">Start the conversation.</p></div>)}
            {chatBox.messages.map((m,i)=>(<div key={i} className={m.sender===user._id?'chat-bubble-me':'chat-bubble-other'}>{m.content}</div>))}
          </div>
          <div className="p-3 bg-white border-top"><div className="input-group">
            <input type="text" className="form-control border-end-0 bg-light" placeholder="Write a reply..." value={currentMessage} onChange={e=>setCurrentMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} style={{borderRadius:'2rem 0 0 2rem'}} />
            <button onClick={sendMessage} className="btn btn-light border border-start-0" style={{borderRadius:'0 2rem 2rem 0'}}><span style={{transform:'rotate(-45deg)',display:'inline-block'}}>➤</span></button>
          </div></div>
        </div>
      )}
    </div>
  );
}
