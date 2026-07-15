'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400&display=swap');
html,body{font-size:16px!important;line-height:1.5!important;letter-spacing:0!important;}
.admin-wrap{font-size:16px;line-height:1.5;letter-spacing:0;}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{font-size:16px;scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:#F5EFE4;color:#0A0A0A;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#EDE5D8;}
::-webkit-scrollbar-thumb{background:#0D4F4A;border-radius:2px;}
img{max-width:100%;display:block;}a{text-decoration:none;color:inherit;}
button,input,textarea,select{font-family:'Inter',sans-serif;}

:root{
  --teal:#0D4F4A; --teal2:#1A6B65; --teal3:#2E8B84;
  --cream:#F5EFE4; --cream2:#EDE5D8; --cream3:#DDD3C0;
  --white:#FAFAF8;
  --dark:#0A0A0A; --dark2:#1A1A1A;
  --text:#0A0A0A; --text2:#4A4A4A; --text3:#8A8A8A;
  --border:rgba(13,79,74,.12); --border2:rgba(13,79,74,.25);
  --success:#0D9B6E; --warning:#D97706; --danger:#DC2626;
  --sidebar:256px;
}

.admin-wrap { font-size: 13px !important; }
.admin-wrap .tbl td { padding: 9px 12px !important; font-size: 12px !important; }
.admin-wrap .tbl th { padding: 8px 12px !important; font-size: 9px !important; }
.admin-wrap .nav-item { padding: 8px 16px !important; font-size: 12px !important; }
.admin-wrap .page { padding: 16px 20px !important; }
.admin-wrap .topbar { height: 52px !important; }
.admin-wrap .stat-val { font-size: 32px !important; }
.admin-wrap .stat-card { padding: 14px 18px !important; }
.admin-wrap .dash-card { padding: 14px 18px !important; }
.admin-wrap .enq-card { padding: 12px 16px !important; }
.admin-wrap .s-card { padding: 14px 18px !important; }
.admin-wrap .btn { padding: 7px 14px !important; font-size: 10px !important; }
.admin-wrap .btn-sm { padding: 5px 10px !important; font-size: 9px !important; }
.admin-wrap .sb-section { padding: 8px 16px 4px !important; font-size: 8px !important; }
.admin-wrap .sb-logo { padding: 14px 16px !important; }
.admin-wrap .sb-footer { padding: 12px 16px !important; }
.admin-wrap .sec-title { font-size: 18px !important; }
.admin-wrap .topbar-title { font-size: 16px !important; }
.admin-wrap .stats-grid { gap: 10px !important; margin-bottom: 14px !important; }
.admin-wrap .dash-grid { gap: 10px !important; }
.admin-wrap .filter-bar { margin-bottom: 12px !important; }
.admin-wrap .tbl-img { width: 40px !important; height: 32px !important; }

@keyframes drawcircle{to{stroke-dashoffset:0;}}
@keyframes rise{to{transform:translateY(0);opacity:1;}}

#login-screen{position:fixed;inset:0;background:var(--teal);display:flex;align-items:center;justify-content:center;z-index:9999;flex-direction:column;}
#login-screen::before{content:'';position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80') center/cover no-repeat;opacity:.08;pointer-events:none;}
.login-box{width:min(420px,92vw);background:var(--cream);border:1px solid rgba(245,239,228,.2);padding:clamp(36px,5vw,52px);position:relative;z-index:1;}
.login-sub{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--text3);margin-bottom:clamp(28px,5vw,40px);}
.login-label{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text2);margin-bottom:8px;}
.login-input{width:100%;background:#fff;border:1px solid var(--border2);color:var(--dark);padding:13px 16px;font-size:14px;margin-bottom:14px;outline:none;transition:border-color .3s;}
.login-input:focus{border-color:var(--teal);}
.login-input::placeholder{color:var(--text3);}
.login-btn{width:100%;background:var(--teal);color:var(--cream);border:none;padding:15px;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;transition:background .3s;margin-top:8px;cursor:pointer;}
.login-btn:hover{background:var(--teal2);}
.login-btn:disabled{opacity:.6;cursor:not-allowed;}
.login-err{color:var(--danger);font-size:12px;text-align:center;margin-top:12px;}

#app{min-height:100vh;background:var(--white);}
.sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--sidebar);background:var(--teal);display:flex;flex-direction:column;z-index:100;transition:transform .35s;}
.sb-logo{padding:16px 20px;border-bottom:1px solid rgba(245,239,228,.12);display:flex;align-items:center;gap:10px;}
.sb-logo-text{font-family:'Fraunces',serif;font-size:20px;font-weight:400;color:var(--cream);letter-spacing:4px;}
.sb-badge{font-size:8px;letter-spacing:1px;text-transform:uppercase;background:rgba(245,239,228,.15);color:var(--cream);padding:3px 8px;margin-left:auto;flex-shrink:0;}
.sb-nav{flex:1;overflow-y:auto;padding:16px 0;}
.sb-section{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(245,239,228,.4);padding:8px 20px 4px;}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 18px;cursor:pointer;transition:all .25s;font-size:13px;color:rgba(245,239,228,.65);border-left:3px solid transparent;}
.nav-item:hover{background:rgba(245,239,228,.08);color:var(--cream);}
.nav-item.active{background:rgba(245,239,228,.12);color:var(--cream);border-left-color:var(--cream);}
.nav-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0;}
.nav-badge{margin-left:auto;background:var(--danger);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;min-width:20px;text-align:center;}
.sb-footer{padding:16px 20px;border-top:1px solid rgba(245,239,228,.12);display:flex;align-items:center;gap:10px;}
.sf-avatar{width:36px;height:36px;background:rgba(245,239,228,.2);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--cream);flex-shrink:0;}
.sf-name{font-size:13px;font-weight:500;color:var(--cream);}
.sf-role{font-size:10px;color:rgba(245,239,228,.5);}
.sf-out{margin-left:auto;background:none;border:none;color:rgba(245,239,228,.5);font-size:18px;cursor:pointer;transition:color .3s;padding:4px;}
.sf-out:hover{color:var(--cream);}
.main{margin-left:var(--sidebar);min-height:100vh;background:var(--white);}
.topbar{background:var(--cream);border-bottom:1px solid var(--border);padding:0 clamp(16px,3vw,32px);height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 8px rgba(13,79,74,.06);}
.topbar-left{display:flex;align-items:center;gap:12px;}
.topbar-title{font-family:'Fraunces',serif;font-size:clamp(16px,2vw,20px);font-weight:300;color:var(--teal);}
.topbar-right{display:flex;align-items:center;gap:10px;}
.tb-btn{background:var(--teal);color:var(--cream);border:none;padding:9px 20px;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:500;transition:background .3s;display:flex;align-items:center;gap:7px;cursor:pointer;}
.tb-btn:hover{background:var(--teal2);}
.tb-clock{font-size:11px;color:var(--text3);letter-spacing:1px;}
.mob-sb-btn{display:none;background:none;border:none;color:var(--teal);font-size:22px;padding:4px;cursor:pointer;}
.page-content{padding:clamp(16px,2vw,28px);}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(8px,1.2vw,12px);margin-bottom:clamp(12px,2vw,18px);}
@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}
@media(max-width:700px){.stats-grid{grid-template-columns:1fr 1fr!important;}}
.stat-card{background:var(--cream);border:1px solid var(--border);padding:clamp(16px,2.5vw,24px);position:relative;overflow:hidden;transition:box-shadow .3s;}
.stat-card:hover{box-shadow:0 4px 20px rgba(13,79,74,.1);}
.stat-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;}
.stat-icon{width:44px;height:44px;background:rgba(13,79,74,.1);display:flex;align-items:center;justify-content:center;font-size:20px;}
.stat-badge{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--teal3);background:rgba(13,79,74,.08);padding:3px 8px;}
.stat-val{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,48px);font-weight:300;color:var(--teal);line-height:1;margin-bottom:4px;}
.stat-label{font-size:11px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;}
.dash-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:clamp(12px,2vw,18px);}
@media(max-width:768px){.dash-grid{grid-template-columns:1fr;}}
.dash-card{background:var(--cream);border:1px solid var(--border);padding:clamp(12px,1.5vw,18px);}
.dc-title{font-size:13px;font-weight:600;color:var(--teal);margin-bottom:16px;letter-spacing:.5px;display:flex;align-items:center;justify-content:space-between;}
.act-item{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);}
.act-item:last-child{border-bottom:none;}
.act-dot{width:7px;height:7px;background:var(--teal3);border-radius:50%;flex-shrink:0;margin-top:4px;}
.act-text{font-size:12px;color:var(--text2);flex:1;line-height:1.5;}
.act-time{font-size:10px;color:var(--text3);white-space:nowrap;}
.qi{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);}
.qi:last-child{border-bottom:none;}
.qi-label{font-size:12px;color:var(--text2);}
.qi-val{font-size:13px;font-weight:600;color:var(--teal);}
.sec-hdr{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:clamp(14px,2.5vw,24px);}
.sec-title{font-family:'Fraunces',serif;font-size:clamp(16px,2vw,22px);font-weight:300;color:var(--teal);}
.sec-sub{font-size:12px;color:var(--text3);margin-top:3px;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;border:none;transition:all .3s;cursor:pointer;font-family:'Inter',sans-serif;}
.btn-primary{background:var(--teal);color:var(--cream);}
.btn-primary:hover{background:var(--teal2);}
.btn-outline{background:transparent;color:var(--teal);border:1.5px solid var(--border2);}
.btn-outline:hover{border-color:var(--teal);background:rgba(13,79,74,.05);}
.btn-danger{background:rgba(220,38,38,.08);color:var(--danger);border:1px solid rgba(220,38,38,.2);}
.btn-danger:hover{background:rgba(220,38,38,.15);}
.btn-success{background:rgba(13,155,110,.08);color:var(--success);border:1px solid rgba(13,155,110,.2);}
.btn-sm{padding:7px 14px;font-size:10px;}
.filter-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:clamp(12px,2vw,20px);align-items:center;}
.search-wrap{position:relative;flex:1;min-width:180px;}
.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:13px;}
.search-inp{width:100%;background:var(--cream);border:1px solid var(--border2);color:var(--dark);padding:10px 12px 10px 36px;font-size:13px;outline:none;transition:border-color .3s;}
.search-inp:focus{border-color:var(--teal);}
.search-inp::placeholder{color:var(--text3);}
.filter-sel{background:var(--cream);border:1.5px solid var(--border2);color:var(--text2);padding:10px 14px;font-size:12px;outline:none;appearance:none;cursor:pointer;min-width:120px;transition:border-color .3s;}
.filter-sel:focus{border-color:var(--teal);}
.tbl-wrap{background:var(--cream);border:1px solid var(--border);overflow-x:auto;}
.tbl{width:100%;border-collapse:collapse;min-width:580px;}
.tbl th{background:var(--cream2);padding:10px 14px;text-align:left;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--teal);font-weight:600;border-bottom:1px solid var(--border);white-space:nowrap;}
.tbl td{padding:11px 14px;font-size:12px;color:var(--text2);border-bottom:1px solid var(--border);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:rgba(13,79,74,.03);}
.tbl-img{width:44px;height:34px;object-fit:cover;background:var(--cream2);}
.tbl-name{color:var(--dark);font-weight:500;}
.tbl-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap;}
.bdg{display:inline-block;padding:3px 10px;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;}
.bdg-active{background:rgba(13,155,110,.1);color:var(--success);}
.bdg-sold{background:rgba(220,38,38,.1);color:var(--danger);}
.bdg-rented{background:rgba(99,102,241,.1);color:#6366F1;}
.bdg-draft{background:rgba(217,119,6,.1);color:var(--warning);}
.bdg-buy{background:rgba(13,79,74,.1);color:var(--teal);}
.bdg-rent{background:rgba(99,102,241,.1);color:#6366F1;}
.bdg-offplan{background:rgba(201,168,76,.15);color:#9C7B30;}
.bdg-published{background:rgba(13,155,110,.1);color:var(--success);}
.modal-ov{display:none;position:fixed;inset:0;background:rgba(13,79,74,.3);backdrop-filter:blur(4px);z-index:500;align-items:center;justify-content:center;padding:16px;}
.modal-ov.open{display:flex;}
.modal{background:var(--cream);border:1px solid var(--border2);width:min(640px,100%);max-height:90vh;overflow-y:auto;}
.modal-sm{width:min(520px,100%);}
.modal-hdr{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--cream);z-index:1;}
.modal-title{font-family:'Fraunces',serif;font-size:20px;font-weight:300;color:var(--teal);}
.modal-close{background:none;border:none;font-size:22px;color:var(--text3);cursor:pointer;transition:color .3s;line-height:1;}
.modal-close:hover{color:var(--dark);}
.modal-body{padding:16px;}
.modal-ftr{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;}
.fg{margin-bottom:16px;}
.fl{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:7px;font-weight:500;}
.fi{width:100%;background:#fff;border:1px solid var(--border2);color:var(--dark);padding:12px 14px;font-size:13px;outline:none;transition:border-color .3s;appearance:none;}
.fi:focus{border-color:var(--teal);}
.fi::placeholder{color:var(--text3);}
textarea.fi{min-height:90px;resize:vertical;}
select.fi option{background:#fff;}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:460px){.fr{grid-template-columns:1fr;}}
.fhint{font-size:11px;color:var(--text3);margin-top:5px;}
.enq-card{background:var(--cream);border:1px solid var(--border);padding:clamp(12px,1.5vw,18px);margin-bottom:12px;transition:box-shadow .3s;border-left:3px solid transparent;}
.enq-card.unread{border-left-color:var(--teal);}
.enq-card:hover{box-shadow:0 4px 20px rgba(13,79,74,.08);}
.enq-top{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:10px;}
.enq-name{font-size:15px;font-weight:600;color:var(--dark);}
.enq-meta{font-size:11px;color:var(--text3);margin-top:3px;display:flex;gap:14px;flex-wrap:wrap;}
.enq-msg{font-size:13px;color:var(--text2);line-height:1.75;font-style:italic;}
.enq-acts{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;}
.enq-status-sel{background:var(--cream);border:1px solid var(--border2);color:var(--text2);padding:7px 12px;font-size:12px;outline:none;cursor:pointer;font-family:'Inter',sans-serif;}
.enq-interest-tag{font-size:11px;padding:2px 10px;background:rgba(13,79,74,.1);color:var(--teal);letter-spacing:1px;text-transform:uppercase;display:inline-block;margin-top:4px;}
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,2vw,20px);}
@media(max-width:640px){.settings-grid{grid-template-columns:1fr;}}
.s-card{background:var(--cream);border:1px solid var(--border);padding:clamp(14px,1.8vw,20px);}
.s-card-title{font-size:14px;font-weight:600;color:var(--teal);margin-bottom:4px;}
.s-card-sub{font-size:11px;color:var(--text3);margin-bottom:18px;}
.empty{text-align:center;padding:clamp(36px,5vw,60px) 20px;color:var(--text3);}
.empty-icon{font-size:44px;margin-bottom:14px;opacity:.45;}
.empty-title{font-size:15px;color:var(--text2);margin-bottom:6px;}
.empty-desc{font-size:12px;}
#toast{position:fixed;bottom:24px;right:24px;z-index:9999;background:var(--teal);border:1px solid var(--teal2);padding:14px 20px;font-size:13px;color:var(--cream);display:none;align-items:center;gap:10px;min-width:260px;box-shadow:0 8px 32px rgba(13,79,74,.3);}
#toast.show{display:flex;}
.pwd-bar-wrap{height:3px;background:var(--cream2);margin-top:6px;}
.pwd-bar{height:100%;width:0;transition:all .3s;}
.img-upload-box{border:1px solid var(--border);background:var(--cream);padding:14px;}
.img-upload-actions{display:flex;gap:8px;margin-bottom:12px;}
.img-upload-actions button{flex:1;padding:10px;border:none;font-size:11px;letter-spacing:1px;cursor:pointer;font-family:'Inter',sans-serif;transition:background .25s;}
.img-upload-btn{background:var(--teal);color:var(--cream);}
.img-upload-btn:hover{background:var(--teal2);}
.img-url-row{display:flex;gap:6px;margin-bottom:10px;}
.img-url-row input{flex:1;background:#fff;border:1px solid var(--border2);color:var(--dark);padding:10px 12px;font-size:13px;outline:none;}
.img-url-row input:focus{border-color:var(--teal);}
.img-url-row button{flex-shrink:0;padding:10px 14px;background:var(--teal);color:var(--cream);border:none;font-size:11px;cursor:pointer;font-family:'Inter',sans-serif;}
.img-url-row button:hover{background:var(--teal2);}
.img-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
.img-thumb-wrap{position:relative;width:80px;height:64px;flex-shrink:0;}
.img-thumb-wrap img{width:100%;height:100%;object-fit:cover;border:1px solid var(--border);display:block;}
.img-thumb-first::after{content:'MAIN';position:absolute;bottom:0;left:0;right:0;background:rgba(13,79,74,.85);color:#fff;font-size:7px;letter-spacing:1.5px;text-align:center;padding:2px 0;}
.img-remove{position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:var(--danger);color:#fff;border:none;border-radius:50%;font-size:11px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}
.img-count{font-size:11px;color:var(--text3);margin-top:8px;}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(13,79,74,.4);z-index:99;}
.sb-overlay.show{display:block;}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.di-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);display:block;margin-bottom:3px;}
.di-val{font-size:13px;color:var(--dark);font-weight:500;}
.detail-msg{background:#fff;border:1px solid var(--border);padding:14px;font-size:13px;color:var(--text2);line-height:1.75;font-style:italic;margin-top:8px;}
.sell-check-row{display:flex;align-items:center;gap:7px;font-size:13px;cursor:pointer;color:var(--text2);}
.sell-check-row input[type=checkbox]{width:15px;height:15px;cursor:pointer;accent-color:var(--teal);}
@media(max-width:768px){
  :root{--sidebar:0px;}
  .sidebar{transform:translateX(-256px);width:256px;}
  .sidebar.open{transform:translateX(0);}
  .main{margin-left:0;}
  .mob-sb-btn{display:block;}
  .tb-clock{display:none;}
  .dash-grid{grid-template-columns:1fr;}
}
`

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', icon: '' })
  const [clock, setClock] = useState('')
  const [allProps, setAllProps] = useState([])
  const [allBlogs, setAllBlogs] = useState([])
  const [allTeam, setAllTeam] = useState([])
  const [allEnquiries, setAllEnquiries] = useState([])
  const [allSellRequests, setAllSellRequests] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [settingsForm, setSettingsForm] = useState({})

  const [pSearch, setPSearch] = useState('')
  const [pType, setPType] = useState('')
  const [pListing, setPListing] = useState('')
  const [pStatus, setPStatus] = useState('')
  const [bSearch, setBSearch] = useState('')
  const [enqFilter, setEnqFilter] = useState('all')
  const [sellFilter, setSellFilter] = useState('all')

  const [propModal, setPropModal] = useState({ open: false, mode: 'add', data: {} })
  const [blogModal, setBlogModal] = useState({ open: false, mode: 'add', data: {} })
  const [teamModal, setTeamModal] = useState({ open: false, mode: 'add', data: {} })
  const [enqModal, setEnqModal] = useState({ open: false, data: {} })
  const [sellModal, setSellModal] = useState({ open: false, data: {} })
  const [jobModal, setJobModal] = useState({ open: false, mode: 'add', data: {} })

  const [propertyImages, setPropertyImages] = useState([])
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInputVal, setUrlInputVal] = useState('')
  const fileInputRef = useRef(null)
  const teamFileInputRef = useRef(null)
  const [teamPhoto, setTeamPhoto] = useState(null)
  const [teamPhotoShowUrl, setTeamPhotoShowUrl] = useState(false)
  const [teamPhotoUrlVal, setTeamPhotoUrlVal] = useState('')

  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [pwdCur, setPwdCur] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdConf, setPwdConf] = useState('')

  const showToast = useCallback((msg, icon = '') => {
    setToast({ show: true, msg, icon })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }, [])

  const apiCall = useCallback(async (endpoint, method = 'GET', body = null, auth = false) => {
    const headers = { 'Content-Type': 'application/json' }
    const tok = token || (typeof window !== 'undefined' ? localStorage.getItem('imaksa_jwt') : '') || ''
    if (auth && tok) headers['Authorization'] = `Bearer ${tok}`
    const opts = { method, headers }
    if (body) opts.body = JSON.stringify(body)
    const res = await fetch(endpoint, opts)
    return res.json()
  }, [token])

  const loadAllData = useCallback(async (tok) => {
    setLoading(true)
    const useTok = tok || token || (typeof window !== 'undefined' ? localStorage.getItem('imaksa_jwt') : '') || ''
    const authH = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${useTok}` }
    try {
      const [pR, bR, tR, eR, sR, stR, jR] = await Promise.all([
        fetch('/api/properties?admin=true', { headers: authH }).then(r => r.json()),
        fetch('/api/blogs?admin=true', { headers: authH }).then(r => r.json()),
        fetch('/api/team', { headers: authH }).then(r => r.json()),
        fetch('/api/enquiries', { headers: authH }).then(r => r.json()),
        fetch('/api/sellrequests', { headers: authH }).then(r => r.json()),
        fetch('/api/settings', { headers: authH }).then(r => r.json()),
        fetch('/api/jobs?admin=true', { headers: authH }).then(r => r.json()),
      ])
      if (pR.success) setAllProps(pR.properties || [])
      if (bR.success) setAllBlogs(bR.blogs || [])
      if (tR.success) setAllTeam(tR.members || [])
      if (eR.success) setAllEnquiries(eR.enquiries || [])
      if (sR.success) setAllSellRequests(sR.sellRequests || [])
      if (stR.success) setSettingsForm(stR.settings || {})
      if (jR.success) setAllJobs(jR.jobs || [])
    } catch {
      showToast('Failed to load data', '')
    }
    setLoading(false)
  }, [token, showToast])

  useEffect(() => {
    const nav = document.querySelector('nav')
    const footer = document.querySelector('footer')
    const wa = document.querySelector('a[aria-label="Chat on WhatsApp"]')
    const ring = document.querySelector('.custom-ring')
    if (nav) nav.style.display = 'none'
    if (footer) footer.style.display = 'none'
    if (wa) wa.style.display = 'none'
    if (ring) ring.style.display = 'none'
    document.body.style.overflow = ''
    return () => {
      if (nav) nav.style.display = ''
      if (footer) footer.style.display = ''
      if (wa) wa.style.display = ''
      if (ring) ring.style.display = ''
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' })
      setClock(`${t} GST`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleLogin = async () => {
    if (!loginUser || !loginPass) return
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      }).then(r => r.json())
      if (res.success && res.token) {
        localStorage.setItem('imaksa_jwt', res.token)
        setToken(res.token)
        setIsLoggedIn(true)
        loadAllData(res.token)
      } else {
        setLoginError('Invalid username or password')
      }
    } catch {
      setLoginError('Connection error — please try again')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('imaksa_jwt')
    setToken('')
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
    setAllProps([])
    setAllBlogs([])
    setAllTeam([])
    setAllEnquiries([])
    setAllSellRequests([])
    setAllJobs([])
  }

  const unreadEnq = allEnquiries.filter(e => !e.read).length
  const unreadSell = allSellRequests.filter(s => !s.read).length

  const fmtPrice = p => {
    if (!p) return 'AED —'
    const n = parseFloat(String(p).replace(/[^0-9.]/g, ''))
    if (isNaN(n)) return `AED ${p}`
    return `AED ${n.toLocaleString()}`
  }

  const fmtDate = d => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const enqStatusLabel = e => !e.read ? 'New' : e.replied ? 'Contacted' : 'Read'

  const pwdStrength = () => {
    if (!pwdNew) return 0
    if (pwdNew.length < 6) return 1
    if (pwdNew.length < 10) return 2
    return 3
  }
  const pwdColor = () => ['#e5e7eb', 'var(--danger)', 'var(--warning)', 'var(--success)'][pwdStrength()]
  const pwdWidth = () => ['0%', '33%', '66%', '100%'][pwdStrength()]

  const navigate = (page) => { setCurrentPage(page); setSidebarOpen(false) }

  const setSF = (key, val) => setSettingsForm(f => ({ ...f, [key]: val }))

  // ── Property handlers ────────────────────────────────────────────────────────
  const openPropModal = (mode, data = {}) => {
    const imgs = (data.images || (data.img ? [data.img] : [])).map(src => ({ src, type: 'url' }))
    setPropertyImages(imgs)
    setShowUrlInput(false)
    setUrlInputVal('')
    setPropModal({ open: true, mode, data: { ...data } })
  }
  const setPropData = (key, val) => setPropModal(m => ({ ...m, data: { ...m.data, [key]: val } }))
  const saveProp = async () => {
    const d = propModal.data
    if (!d.name || !d.location) { showToast('Name and Location are required', ''); return }
    const imgs = propertyImages.map(i => i.src)
    const body = {
      name: d.name || '', price: String(d.price || '').replace(/[^0-9.]/g, ''),
      type: d.type || 'villa', listingType: d.listingType || 'buy',
      status: d.status || 'active', location: d.location || '',
      beds: d.beds || '', baths: d.baths || '', area: d.area || '',
      badge: d.badge || '', desc: d.desc || '', images: imgs, img: imgs[0] || '',
    }
    const res = propModal.mode === 'edit' && d._id
      ? await apiCall(`/api/properties/${d._id}`, 'PUT', body, true)
      : await apiCall('/api/properties', 'POST', body, true)
    if (res.success) {
      setPropModal({ open: false, mode: 'add', data: {} })
      showToast(propModal.mode === 'edit' ? 'Property updated' : 'Property added')
      loadAllData()
    } else showToast(res.error || 'Failed to save property', '')
  }
  const deleteProp = async (id) => {
    if (!confirm('Delete this property? This cannot be undone.')) return
    const res = await apiCall(`/api/properties/${id}`, 'DELETE', null, true)
    if (res.success) { showToast('Property deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }

  // ── Blog handlers ────────────────────────────────────────────────────────────
  const setBlogData = (key, val) => setBlogModal(m => ({ ...m, data: { ...m.data, [key]: val } }))
  const saveBlog = async () => {
    const d = blogModal.data
    if (!d.title || !d.desc) { showToast('Title and description are required', ''); return }
    const body = { title: d.title, desc: d.desc, cat: d.cat || 'Market Update', status: d.status || 'Published', img: d.img || '', readTime: d.readTime || '5 min read' }
    const res = blogModal.mode === 'edit' && d._id
      ? await apiCall(`/api/blogs/${d._id}`, 'PUT', body, true)
      : await apiCall('/api/blogs', 'POST', body, true)
    if (res.success) {
      setBlogModal({ open: false, mode: 'add', data: {} })
      showToast(blogModal.mode === 'edit' ? 'Post updated' : 'Post added')
      loadAllData()
    } else showToast(res.error || 'Failed', '')
  }
  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return
    const res = await apiCall(`/api/blogs/${id}`, 'DELETE', null, true)
    if (res.success) { showToast('Blog post deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }

  // ── Team handlers ────────────────────────────────────────────────────────────
  const openTeamModal = (mode, data = {}) => {
    setTeamPhoto(data.photo ? { src: data.photo, type: 'url' } : null)
    setTeamPhotoShowUrl(false)
    setTeamPhotoUrlVal('')
    setTeamModal({ open: true, mode, data: { ...data } })
  }
  const setTeamData = (key, val) => setTeamModal(m => ({ ...m, data: { ...m.data, [key]: val } }))
  const saveTeam = async () => {
    const d = teamModal.data
    if (!d.name || !d.role) { showToast('Name and Role are required', ''); return }
    const body = { name: d.name, role: d.role, email: d.email || '', phone: d.phone || '', bio: d.bio || '', photo: teamPhoto?.src || '' }
    const res = teamModal.mode === 'edit' && d._id
      ? await apiCall(`/api/team/${d._id}`, 'PUT', body, true)
      : await apiCall('/api/team', 'POST', body, true)
    if (res.success) {
      setTeamModal({ open: false, mode: 'add', data: {} })
      showToast(teamModal.mode === 'edit' ? 'Member updated' : 'Member added')
      loadAllData()
    } else showToast(res.error || 'Failed', '')
  }
  const deleteTeam = async (id) => {
    if (!confirm('Delete this team member?')) return
    const res = await apiCall(`/api/team/${id}`, 'DELETE', null, true)
    if (res.success) { showToast('Member deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }

  // ── Job handlers ─────────────────────────────────────────────────────────────
  const setJobData = (key, val) => setJobModal(m => ({ ...m, data: { ...m.data, [key]: val } }))
  const saveJob = async () => {
    const d = jobModal.data
    if (!d.title) { showToast('Job title is required', ''); return }
    const body = { title: d.title, department: d.department || '', type: d.type || 'Full-time', location: d.location || 'Dubai, UAE', salary: d.salary || '', description: d.description || '', active: d.active !== false }
    const res = jobModal.mode === 'edit' && d._id
      ? await apiCall(`/api/jobs/${d._id}`, 'PUT', body, true)
      : await apiCall('/api/jobs', 'POST', body, true)
    if (res.success) {
      setJobModal({ open: false, mode: 'add', data: {} })
      showToast(jobModal.mode === 'edit' ? 'Job updated' : 'Job added')
      loadAllData()
    } else showToast(res.error || 'Failed', '')
  }
  const deleteJob = async (id) => {
    if (!confirm('Delete this job listing?')) return
    const res = await apiCall(`/api/jobs/${id}`, 'DELETE', null, true)
    if (res.success) { showToast('Job deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }

  // ── Enquiry handlers ─────────────────────────────────────────────────────────
  const updateEnqStatus = async (id, status) => {
    const flags = status === 'New' ? { read: false, replied: false } : { read: true, replied: true }
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    await fetch(`/api/enquiries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` }, body: JSON.stringify(flags) })
    loadAllData()
  }
  const deleteEnq = async (id) => {
    if (!confirm('Delete this enquiry?')) return
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` } }).then(r => r.json())
    if (res.success) { showToast('Enquiry deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }
  const markAllEnqRead = async () => {
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    await fetch('/api/enquiries/read-all', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` } })
    showToast('All enquiries marked as read')
    loadAllData()
  }

  // ── Sell request handlers ────────────────────────────────────────────────────
  const toggleSellContacted = async (id, current) => {
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    await fetch(`/api/sellrequests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` }, body: JSON.stringify({ contacted: !current, read: true }) })
    loadAllData()
  }
  const deleteSell = async (id) => {
    if (!confirm('Delete this sell request?')) return
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    const res = await fetch(`/api/sellrequests/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` } }).then(r => r.json())
    if (res.success) { showToast('Sell request deleted'); loadAllData() }
    else showToast(res.error || 'Failed', '')
  }
  const markAllSellRead = async () => {
    const tok = token || localStorage.getItem('imaksa_jwt') || ''
    await fetch('/api/sellrequests/read-all', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` } })
    showToast('All sell requests marked as read')
    loadAllData()
  }

  // ── Settings handler ─────────────────────────────────────────────────────────
  const saveSettings = async () => {
    const res = await apiCall('/api/settings', 'PUT', settingsForm, true)
    if (res.success) showToast('Settings saved')
    else showToast(res.error || 'Failed to save', '')
  }

  // ── Password handler ─────────────────────────────────────────────────────────
  const changePassword = async () => {
    if (!pwdCur) { showToast('Enter current password', ''); return }
    if (pwdNew.length < 6) { showToast('New password must be at least 6 characters', ''); return }
    if (pwdNew !== pwdConf) { showToast('Passwords do not match', ''); return }
    const res = await apiCall('/api/auth/change-password', 'PUT', { currentPassword: pwdCur, newPassword: pwdNew }, true)
    if (res.success) { showToast('Password updated'); setPwdCur(''); setPwdNew(''); setPwdConf('') }
    else showToast(res.error || 'Failed', '')
  }

  // ── Image handlers ───────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setPropertyImages(prev => [...prev, { src: ev.target.result, type: 'upload' }])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }
  const addImageUrl = () => {
    if (!urlInputVal.trim()) return
    setPropertyImages(prev => [...prev, { src: urlInputVal.trim(), type: 'url' }])
    setUrlInputVal('')
    setShowUrlInput(false)
  }
  const removeImage = (idx) => setPropertyImages(prev => prev.filter((_, i) => i !== idx))

  // ── Team photo handlers ──────────────────────────────────────────────────────
  const handleTeamPhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setTeamPhoto({ src: ev.target.result, type: 'upload' })
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  const addTeamPhotoUrl = () => {
    if (!teamPhotoUrlVal.trim()) return
    setTeamPhoto({ src: teamPhotoUrlVal.trim(), type: 'url' })
    setTeamPhotoUrlVal('')
    setTeamPhotoShowUrl(false)
  }

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filteredProps = allProps.filter(p => {
    const s = pSearch.toLowerCase()
    if (s && !p.name?.toLowerCase().includes(s) && !p.location?.toLowerCase().includes(s)) return false
    if (pType && p.type?.toLowerCase() !== pType) return false
    if (pListing && p.listingType !== pListing) return false
    if (pStatus && p.status !== pStatus) return false
    return true
  })
  const filteredBlogs = allBlogs.filter(b => {
    if (!bSearch) return true
    const s = bSearch.toLowerCase()
    return b.title?.toLowerCase().includes(s) || b.cat?.toLowerCase().includes(s)
  })
  const filteredEnq = allEnquiries.filter(e => {
    if (enqFilter === 'unread') return !e.read
    if (enqFilter === 'contacted') return e.replied
    return true
  })
  const filteredSell = allSellRequests.filter(s => {
    if (sellFilter === 'unread') return !s.read
    if (sellFilter === 'contacted') return s.contacted
    if (sellFilter === 'new') return !s.contacted
    return true
  })

  const pageTitles = {
    dashboard: 'Dashboard', properties: 'Properties', blogs: 'Blog Posts',
    team: 'Team Members', jobs: 'Job Listings', enquiries: 'Enquiries', sell: 'Sell Requests',
    settings: 'Site Settings', password: 'Change Password',
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <>
        <style>{CSS}</style>
        <div id="login-screen">
          <svg width="120" height="120" viewBox="0 0 271 271" xmlns="http://www.w3.org/2000/svg" style={{filter:'drop-shadow(0 0 14px rgba(201,168,76,.35))'}}>
            <defs>
              <linearGradient id="ag1" x1="0%" y1="10%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#9C7B30"/>
                <stop offset="30%" stopColor="#E8C978"/>
                <stop offset="50%" stopColor="#FBEAB8"/>
                <stop offset="70%" stopColor="#D4AE5C"/>
                <stop offset="100%" stopColor="#A9843A"/>
              </linearGradient>
              <linearGradient id="ag2" x1="0%" y1="10%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#9C7B30"/>
                <stop offset="40%" stopColor="#EFD08A"/>
                <stop offset="60%" stopColor="#D4AE5C"/>
                <stop offset="100%" stopColor="#A9843A"/>
              </linearGradient>
            </defs>
            <circle cx="135" cy="135" r="120" fill="none" stroke="#C9A84C" strokeWidth="2.2" strokeDasharray="754" strokeDashoffset="754" style={{animation:'drawcircle 1s 0.15s cubic-bezier(0.4,0,0.2,1) forwards'}}/>
            <circle cx="135" cy="135" r="115" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" strokeDasharray="723" strokeDashoffset="723" style={{animation:'drawcircle 1s 0.25s cubic-bezier(0.4,0,0.2,1) forwards'}}/>
            <g style={{transform:'translateY(60px)',opacity:0,animation:'rise 0.6s 0.65s cubic-bezier(0.16,1,0.3,1) forwards'}}>
              <polygon points="62.9,100.0 74.4,100.0 74.4,216.7 62.9,216.7" fill="#F5EFE4"/>
              <polygon points="74.4,100.0 100.7,100.0 100.7,216.7 74.4,216.7" fill="url(#ag1)"/>
              <polygon points="74.4,100.0 100.7,68.0 100.7,100.0" fill="url(#ag1)"/>
              <polygon points="98.3,81.6 105.2,81.6 105.2,216.7 98.3,216.7" fill="#0D4F4A" opacity="0.9"/>
            </g>
            <g style={{transform:'translateY(60px)',opacity:0,animation:'rise 0.6s 0.8s cubic-bezier(0.16,1,0.3,1) forwards'}}>
              <path d="M 105.2,216.7 L 105.2,199.6 L 148.8,39.3 L 163.6,39.3 L 207.1,199.6 L 207.1,216.7 L 179.6,216.7 L 170.5,184.6 L 141.9,184.6 L 132.7,216.7 Z" fill="url(#ag2)"/>
              <polygon points="156.1,90.8 168.2,175.5 144.1,175.5" fill="#0D4F4A"/>
            </g>
          </svg>

          <div style={{fontFamily:`'Fraunces',serif`,fontSize:30,fontWeight:300,color:'#F5EFE4',letterSpacing:12,marginTop:10,opacity:0,animation:'rise 0.8s 1.2s forwards'}}>
            IMAKSA
          </div>
          <div style={{fontSize:9,letterSpacing:4,textTransform:'uppercase',color:'#C9A84C',marginTop:4,opacity:0,animation:'rise 0.6s 1.4s forwards'}}>
            Real Estate LLC
          </div>

          <div className="login-box" style={{marginTop:32}}>
            <div className="login-sub">Admin Panel · Secure Access</div>
            <label className="login-label">Username</label>
            <input
              className="login-input"
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin"
              autoComplete="username"
            />
            <label className="login-label">Password</label>
            <div style={{position:'relative'}}>
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{marginBottom:0,paddingRight:44}}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:18,padding:0,lineHeight:1}}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <button className="login-btn" onClick={handleLogin} disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In →'}
            </button>
            <div className="login-err" style={{display: loginError ? 'block' : 'none'}}>{loginError}</div>
          </div>
        </div>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN APP
  // ═══════════════════════════════════════════════════════════════════════════
  const navGroups = [
    { section: 'Main', items: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }] },
    { section: 'Content', items: [
      { id: 'properties', icon: '🏡', label: 'Properties' },
      { id: 'blogs', icon: '📝', label: 'Blog Posts' },
      { id: 'team', icon: '👥', label: 'Team Members' },
      { id: 'jobs', icon: '💼', label: 'Jobs' },
    ]},
    { section: 'CRM', items: [
      { id: 'enquiries', icon: '📩', label: 'Enquiries', badge: unreadEnq },
      { id: 'sell', icon: '🏷️', label: 'Sell Requests', badge: unreadSell },
    ]},
    { section: 'Config', items: [
      { id: 'settings', icon: '⚙️', label: 'Site Settings' },
      { id: 'password', icon: '🔑', label: 'Change Password' },
    ]},
  ]

  const showAddBtn = ['properties', 'blogs', 'team', 'jobs'].includes(currentPage)
  const handleAddNew = () => {
    if (currentPage === 'properties') openPropModal('add')
    else if (currentPage === 'blogs') setBlogModal({ open: true, mode: 'add', data: {} })
    else if (currentPage === 'team') openTeamModal('add')
    else if (currentPage === 'jobs') setJobModal({ open: true, mode: 'add', data: {} })
  }

  return (
    <div id="app" className="admin-wrap">
      <style>{CSS}</style>

      {/* Sidebar overlay */}
      <div className={`sb-overlay${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sb-logo">
          <svg width="28" height="28" viewBox="0 0 271 271" xmlns="http://www.w3.org/2000/svg">
            <circle cx="135" cy="135" r="120" fill="none" stroke="#C9A84C" strokeWidth="2.5"/>
            <polygon points="62.9,100.0 74.4,100.0 74.4,216.7 62.9,216.7" fill="#F5EFE4"/>
            <polygon points="74.4,100.0 100.7,100.0 100.7,216.7 74.4,216.7" fill="#C9A84C"/>
            <polygon points="74.4,100.0 100.7,68.0 100.7,100.0" fill="#C9A84C"/>
            <polygon points="98.3,81.6 105.2,81.6 105.2,216.7 98.3,216.7" fill="rgba(245,239,228,0.4)"/>
            <path d="M 105.2,216.7 L 105.2,199.6 L 148.8,39.3 L 163.6,39.3 L 207.1,199.6 L 207.1,216.7 L 179.6,216.7 L 170.5,184.6 L 141.9,184.6 L 132.7,216.7 Z" fill="#C9A84C"/>
            <polygon points="156.1,90.8 168.2,175.5 144.1,175.5" fill="#0D4F4A"/>
          </svg>
          <span className="sb-logo-text">IMAKSA</span>
          <span className="sb-badge">Admin</span>
        </div>

        <nav className="sb-nav">
          {navGroups.map(g => (
            <div key={g.section}>
              <div className="sb-section">{g.section}</div>
              {g.items.map(item => (
                <div
                  key={item.id}
                  className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                  onClick={() => navigate(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sf-avatar">A</div>
          <div>
            <div className="sf-name">Admin</div>
            <div className="sf-role">IMAKSA Owner</div>
          </div>
          <button className="sf-out" onClick={handleLogout} title="Sign Out">⏻</button>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <button className="mob-sb-btn" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <div className="topbar-title">{pageTitles[currentPage] || 'Dashboard'}</div>
          </div>
          <div className="topbar-right">
            <span className="tb-clock">{clock}</span>
            {currentPage === 'settings' && (
              <button className="tb-btn" onClick={saveSettings}>💾 Save All</button>
            )}
            {showAddBtn && (
              <button className="tb-btn" onClick={handleAddNew}>+ Add New</button>
            )}
          </div>
        </div>

        <div className="page-content">
          {loading
            ? <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading...</div></div>
            : currentPage === 'dashboard' ? <PageDashboard allProps={allProps} allBlogs={allBlogs} allTeam={allTeam} allEnquiries={allEnquiries} unreadEnq={unreadEnq} unreadSell={unreadSell} fmtDate={fmtDate} navigate={navigate} />
            : currentPage === 'properties' ? <PageProperties filteredProps={filteredProps} pSearch={pSearch} setPSearch={setPSearch} pType={pType} setPType={setPType} pListing={pListing} setPListing={setPListing} pStatus={pStatus} setPStatus={setPStatus} openPropModal={openPropModal} deleteProp={deleteProp} fmtPrice={fmtPrice} />
            : currentPage === 'blogs' ? <PageBlogs filteredBlogs={filteredBlogs} bSearch={bSearch} setBSearch={setBSearch} setBlogModal={setBlogModal} deleteBlog={deleteBlog} fmtDate={fmtDate} />
            : currentPage === 'team' ? <PageTeam allTeam={allTeam} openTeamModal={openTeamModal} deleteTeam={deleteTeam} />
            : currentPage === 'jobs' ? <PageJobs allJobs={allJobs} setJobModal={setJobModal} deleteJob={deleteJob} />
            : currentPage === 'enquiries' ? <PageEnquiries filteredEnq={filteredEnq} enqFilter={enqFilter} setEnqFilter={setEnqFilter} unreadEnq={unreadEnq} markAllEnqRead={markAllEnqRead} updateEnqStatus={updateEnqStatus} deleteEnq={deleteEnq} setEnqModal={setEnqModal} enqStatusLabel={enqStatusLabel} fmtDate={fmtDate} />
            : currentPage === 'sell' ? <PageSell filteredSell={filteredSell} sellFilter={sellFilter} setSellFilter={setSellFilter} unreadSell={unreadSell} markAllSellRead={markAllSellRead} toggleSellContacted={toggleSellContacted} deleteSell={deleteSell} setSellModal={setSellModal} fmtDate={fmtDate} />
            : currentPage === 'settings' ? <PageSettings settingsForm={settingsForm} setSF={setSF} />
            : currentPage === 'password' ? <PagePassword pwdCur={pwdCur} setPwdCur={setPwdCur} pwdNew={pwdNew} setPwdNew={setPwdNew} pwdConf={pwdConf} setPwdConf={setPwdConf} changePassword={changePassword} pwdColor={pwdColor} pwdWidth={pwdWidth} pwdStrength={pwdStrength} />
            : null
          }
        </div>
      </div>

      {/* Modals */}
      {propModal.open && (
        <PropModal propModal={propModal} setPropModal={setPropModal} setPropData={setPropData} saveProp={saveProp}
          propertyImages={propertyImages} showUrlInput={showUrlInput} setShowUrlInput={setShowUrlInput}
          urlInputVal={urlInputVal} setUrlInputVal={setUrlInputVal} addImageUrl={addImageUrl} removeImage={removeImage}
          fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} />
      )}
      {blogModal.open && (
        <BlogModal blogModal={blogModal} setBlogModal={setBlogModal} setBlogData={setBlogData} saveBlog={saveBlog} />
      )}
      {teamModal.open && (
        <TeamModal teamModal={teamModal} setTeamModal={setTeamModal} setTeamData={setTeamData} saveTeam={saveTeam}
          teamPhoto={teamPhoto} setTeamPhoto={setTeamPhoto} teamPhotoShowUrl={teamPhotoShowUrl} setTeamPhotoShowUrl={setTeamPhotoShowUrl}
          teamPhotoUrlVal={teamPhotoUrlVal} setTeamPhotoUrlVal={setTeamPhotoUrlVal} teamFileInputRef={teamFileInputRef}
          handleTeamPhotoUpload={handleTeamPhotoUpload} addTeamPhotoUrl={addTeamPhotoUrl} />
      )}
      {enqModal.open && (
        <EnqModal enqModal={enqModal} setEnqModal={setEnqModal} fmtDate={fmtDate} />
      )}
      {sellModal.open && (
        <SellModal sellModal={sellModal} setSellModal={setSellModal} fmtDate={fmtDate} />
      )}
      {jobModal.open && (
        <JobModal jobModal={jobModal} setJobModal={setJobModal} setJobData={setJobData} saveJob={saveJob} />
      )}

      {/* Toast */}
      <div id="toast" className={toast.show ? 'show' : ''}>
        {toast.icon && <span>{toast.icon}</span>}
        <span>{toast.msg}</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function PageDashboard({ allProps, allBlogs, allTeam, allEnquiries, unreadEnq, unreadSell, fmtDate, navigate }) {
  const activeProps = allProps.filter(p => p.status === 'active').length
  const publishedBlogs = allBlogs.filter(b => b.status === 'Published').length
  const recentEnq = [...allEnquiries].slice(0, 5)

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">🏡</div>
            <div className="stat-badge">Listings</div>
          </div>
          <div className="stat-val">{allProps.length}</div>
          <div className="stat-label">Total Properties</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">📝</div>
            <div className="stat-badge">Articles</div>
          </div>
          <div className="stat-val">{allBlogs.length}</div>
          <div className="stat-label">Blog Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">📩</div>
            <div className="stat-badge">Leads</div>
          </div>
          <div className="stat-val">{unreadEnq}</div>
          <div className="stat-label">Unread Enquiries</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">👥</div>
            <div className="stat-badge">Staff</div>
          </div>
          <div className="stat-val">{allTeam.length}</div>
          <div className="stat-label">Team Members</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dc-title">Recent Activity</div>
          {recentEnq.length === 0
            ? <div style={{fontSize:12,color:'var(--text3)',padding:'20px 0'}}>No enquiries yet</div>
            : recentEnq.map(e => (
              <div key={e._id} className="act-item">
                <div className="act-dot" />
                <div className="act-text">
                  <strong>{e.name}</strong> — {e.interest || 'General enquiry'}
                </div>
                <div className="act-time">{fmtDate(e.createdAt)}</div>
              </div>
            ))
          }
        </div>
        <div className="dash-card">
          <div className="dc-title">Quick Overview</div>
          <div className="qi"><span className="qi-label">Active Listings</span><span className="qi-val">{activeProps}</span></div>
          <div className="qi"><span className="qi-label">Published Posts</span><span className="qi-val">{publishedBlogs}</span></div>
          <div className="qi"><span className="qi-label">Unread Enquiries</span><span className="qi-val">{unreadEnq}</span></div>
          <div className="qi"><span className="qi-label">New Sell Requests</span><span className="qi-val">{unreadSell}</span></div>
          <div className="qi"><span className="qi-label">Team Members</span><span className="qi-val">{allTeam.length}</span></div>
        </div>
      </div>
    </>
  )
}

function PageProperties({ filteredProps, pSearch, setPSearch, pType, setPType, pListing, setPListing, pStatus, setPStatus, openPropModal, deleteProp, fmtPrice }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Properties</div>
          <div className="sec-sub">{filteredProps.length} listing{filteredProps.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-inp" type="text" placeholder="Search properties..." value={pSearch} onChange={e => setPSearch(e.target.value)} />
        </div>
        <select className="filter-sel" value={pType} onChange={e => setPType(e.target.value)}>
          <option value="">All Types</option>
          <option value="villa">Villa / Mansion</option>
          <option value="penthouse">Penthouse</option>
          <option value="apartment">Apartment</option>
          <option value="offplan">Off-Plan</option>
          <option value="commercial">Commercial</option>
        </select>
        <select className="filter-sel" value={pListing} onChange={e => setPListing(e.target.value)}>
          <option value="">All Listings</option>
          <option value="buy">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="offplan">Off-Plan</option>
        </select>
        <select className="filter-sel" value={pStatus} onChange={e => setPStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Image</th>
              <th>Property</th>
              <th>Type</th>
              <th>Listing</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProps.length === 0 && (
              <tr><td colSpan="8"><div className="empty"><div className="empty-icon">🏡</div><div className="empty-title">No properties found</div></div></td></tr>
            )}
            {filteredProps.map(p => (
              <tr key={p._id}>
                <td>
                  {p.img
                    ? <img src={p.img} alt={p.name} className="tbl-img" />
                    : <div className="tbl-img" style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🏡</div>
                  }
                </td>
                <td>
                  <div className="tbl-name">{p.name}</div>
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{p.location}</div>
                </td>
                <td style={{textTransform:'capitalize',fontSize:12}}>{p.type}</td>
                <td>
                  <span className={`bdg bdg-${p.listingType}`}>
                    {p.listingType === 'buy' ? 'For Sale' : p.listingType === 'rent' ? 'For Rent' : 'Off-Plan'}
                  </span>
                </td>
                <td style={{fontWeight:600,fontSize:12}}>{fmtPrice(p.price)}</td>
                <td style={{fontSize:12,color:'var(--text3)'}}>{p.location || '—'}</td>
                <td><span className={`bdg bdg-${p.status}`}>{p.status}</span></td>
                <td>
                  <div className="tbl-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openPropModal('edit', p)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProp(p._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function PageBlogs({ filteredBlogs, bSearch, setBSearch, setBlogModal, deleteBlog, fmtDate }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Blog Posts</div>
          <div className="sec-sub">{filteredBlogs.length} post{filteredBlogs.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-inp" type="text" placeholder="Search posts..." value={bSearch} onChange={e => setBSearch(e.target.value)} />
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length === 0 && (
              <tr><td colSpan="5"><div className="empty"><div className="empty-icon">📝</div><div className="empty-title">No posts found</div></div></td></tr>
            )}
            {filteredBlogs.map(b => (
              <tr key={b._id}>
                <td>
                  <div className="tbl-name">{b.title}</div>
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{b.readTime}</div>
                </td>
                <td style={{fontSize:12}}>{b.cat}</td>
                <td style={{fontSize:12}}>{fmtDate(b.createdAt)}</td>
                <td><span className={`bdg bdg-${b.status === 'Published' ? 'published' : 'draft'}`}>{b.status}</span></td>
                <td>
                  <div className="tbl-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setBlogModal({ open: true, mode: 'edit', data: { ...b } })}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteBlog(b._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function PageTeam({ allTeam, openTeamModal, deleteTeam }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Team Members</div>
          <div className="sec-sub">{allTeam.length} member{allTeam.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allTeam.length === 0 && (
              <tr><td colSpan="6"><div className="empty"><div className="empty-icon">👥</div><div className="empty-title">No team members yet</div></div></td></tr>
            )}
            {allTeam.map(m => (
              <tr key={m._id}>
                <td>
                  {m.photo
                    ? <img src={m.photo} alt={m.name} style={{width:40,height:40,objectFit:'cover',borderRadius:'50%'}} />
                    : <div style={{width:40,height:40,borderRadius:'50%',background:'var(--cream2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>👤</div>
                  }
                </td>
                <td><div className="tbl-name">{m.name}</div></td>
                <td style={{fontSize:12}}>{m.role}</td>
                <td style={{fontSize:12}}>{m.email || '—'}</td>
                <td style={{fontSize:12}}>{m.phone || '—'}</td>
                <td>
                  <div className="tbl-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openTeamModal('edit', m)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteTeam(m._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function PageEnquiries({ filteredEnq, enqFilter, setEnqFilter, unreadEnq, markAllEnqRead, updateEnqStatus, deleteEnq, setEnqModal, enqStatusLabel, fmtDate }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Enquiries</div>
          <div className="sec-sub">{filteredEnq.length} shown</div>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <select className="filter-sel" value={enqFilter} onChange={e => setEnqFilter(e.target.value)}>
            <option value="all">All Enquiries</option>
            <option value="unread">New / Unread</option>
            <option value="contacted">Contacted</option>
          </select>
          {unreadEnq > 0 && (
            <button className="btn btn-success btn-sm" onClick={markAllEnqRead}>✓ Mark All Read</button>
          )}
        </div>
      </div>
      {filteredEnq.length === 0
        ? <div className="empty"><div className="empty-icon">📩</div><div className="empty-title">No enquiries found</div></div>
        : filteredEnq.map(e => (
          <div key={e._id} className={`enq-card${!e.read ? ' unread' : ''}`}>
            <div className="enq-top">
              <div>
                <div className="enq-name">{e.name}</div>
                {e.interest && <div className="enq-interest-tag">{e.interest}</div>}
                <div className="enq-meta">
                  {e.email && <span>✉️ {e.email}</span>}
                  {e.phone && <span>📱 {e.phone}</span>}
                  {e.budget && <span>💰 {e.budget}</span>}
                  <span>🗓️ {fmtDate(e.createdAt)}</span>
                </div>
              </div>
              <select className="enq-status-sel" value={enqStatusLabel(e)} onChange={ev => updateEnqStatus(e._id, ev.target.value)}>
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {e.message && <div className="enq-msg">"{e.message}"</div>}
            <div className="enq-acts">
              <button className="btn btn-outline btn-sm" onClick={() => setEnqModal({ open: true, data: e })}>👁️ View</button>
              {e.email && <a href={`mailto:${e.email}?subject=Re: Your Property Enquiry&body=Dear ${e.name},%0D%0A%0D%0AThank you for your enquiry.`} className="btn btn-primary btn-sm">✉️ Reply</a>}
              {e.phone && <a href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(e.name)}, thank you for your enquiry.`} className="btn btn-success btn-sm" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>}
              <button className="btn btn-danger btn-sm" onClick={() => deleteEnq(e._id)}>🗑️</button>
            </div>
          </div>
        ))
      }
    </>
  )
}

function PageSell({ filteredSell, sellFilter, setSellFilter, unreadSell, markAllSellRead, toggleSellContacted, deleteSell, setSellModal, fmtDate }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Sell Requests</div>
          <div className="sec-sub">{filteredSell.length} shown</div>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <select className="filter-sel" value={sellFilter} onChange={e => setSellFilter(e.target.value)}>
            <option value="all">All Requests</option>
            <option value="unread">New / Unread</option>
            <option value="new">Not Contacted</option>
            <option value="contacted">Contacted</option>
          </select>
          {unreadSell > 0 && (
            <button className="btn btn-success btn-sm" onClick={markAllSellRead}>✓ Mark All Read</button>
          )}
        </div>
      </div>
      {filteredSell.length === 0
        ? <div className="empty"><div className="empty-icon">🏷️</div><div className="empty-title">No sell requests found</div></div>
        : filteredSell.map(s => (
          <div key={s._id} className={`enq-card${!s.read ? ' unread' : ''}`}>
            <div className="enq-top">
              <div>
                <div className="enq-name">{s.name}</div>
                {s.propertyType && <div className="enq-interest-tag">{s.propertyType}</div>}
                <div className="enq-meta">
                  {s.email && <span>✉️ {s.email}</span>}
                  {s.phone && <span>📱 {s.phone}</span>}
                  {s.location && <span>📍 {s.location}</span>}
                  {s.askingPrice && <span>💰 AED {s.askingPrice}</span>}
                  <span>🗓️ {fmtDate(s.createdAt)}</span>
                </div>
              </div>
              <label className="sell-check-row">
                <input type="checkbox" checked={!!s.contacted} onChange={() => toggleSellContacted(s._id, s.contacted)} />
                Contacted
              </label>
            </div>
            {s.notes && <div className="enq-msg">"{s.notes}"</div>}
            <div className="enq-acts">
              <button className="btn btn-outline btn-sm" onClick={() => setSellModal({ open: true, data: s })}>👁️ View</button>
              {s.email && <a href={`mailto:${s.email}?subject=Re: Your Property Listing Request`} className="btn btn-primary btn-sm">✉️ Reply</a>}
              {s.phone && <a href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}?text=Hi ${encodeURIComponent(s.name)}, we received your request to sell your property.`} className="btn btn-success btn-sm" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>}
              <button className="btn btn-danger btn-sm" onClick={() => deleteSell(s._id)}>🗑️</button>
            </div>
          </div>
        ))
      }
    </>
  )
}

function PageSettings({ settingsForm, setSF }) {
  return (
    <div className="settings-grid">
      <div className="s-card">
        <div className="s-card-title">📞 Contact Details</div>
        <div className="s-card-sub">Phone, email and WhatsApp</div>
        <div className="fg"><label className="fl">Phone</label><input className="fi" type="text" value={settingsForm.phone || ''} onChange={e => setSF('phone', e.target.value)} placeholder="+971 50 000 0000" /></div>
        <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={settingsForm.email || ''} onChange={e => setSF('email', e.target.value)} placeholder="info@imaksa.com" /></div>
        <div className="fg"><label className="fl">WhatsApp (digits only)</label><input className="fi" type="text" value={settingsForm.wa || ''} onChange={e => setSF('wa', e.target.value)} placeholder="971501234567" /></div>
      </div>
      <div className="s-card">
        <div className="s-card-title">📍 Office Information</div>
        <div className="s-card-sub">Address, hours and map</div>
        <div className="fg"><label className="fl">Address</label><input className="fi" type="text" value={settingsForm.addr || ''} onChange={e => setSF('addr', e.target.value)} placeholder="Office address" /></div>
        <div className="fg"><label className="fl">Working Hours</label><input className="fi" type="text" value={settingsForm.hrs || ''} onChange={e => setSF('hrs', e.target.value)} placeholder="Mon–Fri 9am–6pm" /></div>
        <div className="fg"><label className="fl">Google Maps Embed URL</label><input className="fi" type="url" value={settingsForm.maps || ''} onChange={e => setSF('maps', e.target.value)} placeholder="https://www.google.com/maps/embed?..." /></div>
      </div>
      <div className="s-card">
        <div className="s-card-title">🌐 Social Media</div>
        <div className="s-card-sub">LinkedIn, Instagram, Facebook</div>
        <div className="fg"><label className="fl">LinkedIn</label><input className="fi" type="url" value={settingsForm.li || ''} onChange={e => setSF('li', e.target.value)} placeholder="https://linkedin.com/company/..." /></div>
        <div className="fg"><label className="fl">Instagram</label><input className="fi" type="url" value={settingsForm.ig || ''} onChange={e => setSF('ig', e.target.value)} placeholder="https://instagram.com/..." /></div>
        <div className="fg"><label className="fl">Facebook</label><input className="fi" type="url" value={settingsForm.fb || ''} onChange={e => setSF('fb', e.target.value)} placeholder="https://facebook.com/..." /></div>
      </div>
      <div className="s-card">
        <div className="s-card-title">🏢 Company Info</div>
        <div className="s-card-sub">Name, license and founding year</div>
        <div className="fg"><label className="fl">Company Name</label><input className="fi" type="text" value={settingsForm.co || ''} onChange={e => setSF('co', e.target.value)} placeholder="IMAKSA Properties LLC" /></div>
        <div className="fg"><label className="fl">RERA License No.</label><input className="fi" type="text" value={settingsForm.rera || ''} onChange={e => setSF('rera', e.target.value)} placeholder="RERA-00000" /></div>
        <div className="fg"><label className="fl">Founded Year</label><input className="fi" type="text" value={settingsForm.year || ''} onChange={e => setSF('year', e.target.value)} placeholder="2012" /></div>
      </div>
    </div>
  )
}

function PagePassword({ pwdCur, setPwdCur, pwdNew, setPwdNew, pwdConf, setPwdConf, changePassword, pwdColor, pwdWidth, pwdStrength }) {
  const str = pwdStrength()
  return (
    <div style={{maxWidth:460}}>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Change Password</div>
          <div className="sec-sub">Update your admin credentials</div>
        </div>
      </div>
      <div className="s-card">
        <div className="fg">
          <label className="fl">Current Password</label>
          <input className="fi" type="password" value={pwdCur} onChange={e => setPwdCur(e.target.value)} placeholder="Enter current password" autoComplete="current-password" />
        </div>
        <div className="fg">
          <label className="fl">New Password</label>
          <input className="fi" type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} placeholder="Minimum 6 characters" autoComplete="new-password" />
          <div className="pwd-bar-wrap">
            <div className="pwd-bar" style={{width:pwdWidth(),background:pwdColor()}} />
          </div>
          {pwdNew && <div style={{fontSize:11,color:pwdColor(),marginTop:4,fontWeight:500}}>
            {str === 1 ? 'Weak — too short' : str === 2 ? 'Moderate' : 'Strong'}
          </div>}
        </div>
        <div className="fg">
          <label className="fl">Confirm New Password</label>
          <input className="fi" type="password" value={pwdConf} onChange={e => setPwdConf(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
          {pwdConf && pwdNew && pwdConf !== pwdNew && <div style={{fontSize:11,color:'var(--danger)',marginTop:4}}>Passwords do not match</div>}
        </div>
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={changePassword}>🔑 Update Password</button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function PropModal({ propModal, setPropModal, setPropData, saveProp, propertyImages, showUrlInput, setShowUrlInput, urlInputVal, setUrlInputVal, addImageUrl, removeImage, fileInputRef, handleImageUpload }) {
  const d = propModal.data
  const close = () => setPropModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">{propModal.mode === 'edit' ? 'Edit Property' : 'Add Property'}</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="fr">
            <div className="fg"><label className="fl">Property Name *</label><input className="fi" type="text" value={d.name || ''} onChange={e => setPropData('name', e.target.value)} placeholder="e.g. Palm View Villa" /></div>
            <div className="fg"><label className="fl">Price (AED)</label><input className="fi" type="text" value={d.price || ''} onChange={e => setPropData('price', e.target.value)} placeholder="e.g. 3500000" /></div>
          </div>
          <div className="fr">
            <div className="fg">
              <label className="fl">Type</label>
              <select className="fi" value={d.type || 'villa'} onChange={e => setPropData('type', e.target.value)}>
                <option value="villa">Villa / Mansion</option>
                <option value="penthouse">Penthouse</option>
                <option value="apartment">Apartment</option>
                <option value="offplan">Off-Plan</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Listing Type</label>
              <select className="fi" value={d.listingType || 'buy'} onChange={e => setPropData('listingType', e.target.value)}>
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="offplan">Off-Plan</option>
              </select>
            </div>
          </div>
          <div className="fg">
            <label className="fl">Status</label>
            <select className="fi" value={d.status || 'active'} onChange={e => setPropData('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="fg"><label className="fl">Location *</label><input className="fi" type="text" value={d.location || ''} onChange={e => setPropData('location', e.target.value)} placeholder="e.g. Palm Jumeirah, Dubai" /></div>
          <div className="fr">
            <div className="fg"><label className="fl">Bedrooms</label><input className="fi" type="text" value={d.beds || ''} onChange={e => setPropData('beds', e.target.value)} placeholder="e.g. 4" /></div>
            <div className="fg"><label className="fl">Bathrooms</label><input className="fi" type="text" value={d.baths || ''} onChange={e => setPropData('baths', e.target.value)} placeholder="e.g. 5" /></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">Area (Sq.Ft)</label><input className="fi" type="text" value={d.area || ''} onChange={e => setPropData('area', e.target.value)} placeholder="e.g. 4500" /></div>
            <div className="fg"><label className="fl">Badge</label><input className="fi" type="text" value={d.badge || ''} onChange={e => setPropData('badge', e.target.value)} placeholder="e.g. New Launch" /></div>
          </div>
          <div className="fg"><label className="fl">Description</label><textarea className="fi" value={d.desc || ''} onChange={e => setPropData('desc', e.target.value)} placeholder="Property description..." /></div>

          <label className="fl" style={{marginBottom:10}}>Images</label>
          <div className="img-upload-box">
            <div className="img-upload-actions">
              <button className="img-upload-btn" onClick={() => fileInputRef.current?.click()}>📁 Upload</button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleImageUpload} />
              <button className="btn-outline" style={{flex:1,padding:10,border:'1px solid var(--border2)',fontSize:11,letterSpacing:1,cursor:'pointer',background:'transparent',color:'var(--teal)',fontFamily:'Inter,sans-serif'}} onClick={() => setShowUrlInput(v => !v)}>🔗 Add URL</button>
            </div>
            {showUrlInput && (
              <div className="img-url-row">
                <input type="url" value={urlInputVal} onChange={e => setUrlInputVal(e.target.value)} placeholder="https://example.com/image.jpg" onKeyDown={e => e.key === 'Enter' && addImageUrl()} />
                <button onClick={addImageUrl}>Add</button>
                <button onClick={() => { setShowUrlInput(false); setUrlInputVal('') }} style={{background:'var(--cream2)',color:'var(--text2)'}}>✕</button>
              </div>
            )}
            {propertyImages.length > 0 && (
              <>
                <div className="img-grid">
                  {propertyImages.map((img, i) => (
                    <div key={i} className={`img-thumb-wrap${i === 0 ? ' img-thumb-first' : ''}`}>
                      <img src={img.src} alt="" onError={e => { e.target.style.display = 'none' }} />
                      <button className="img-remove" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="img-count">{propertyImages.length} image{propertyImages.length !== 1 ? 's' : ''} — first is the main card image</div>
              </>
            )}
          </div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={saveProp}>💾 {propModal.mode === 'edit' ? 'Update' : 'Add Property'}</button>
        </div>
      </div>
    </div>
  )
}

function BlogModal({ blogModal, setBlogModal, setBlogData, saveBlog }) {
  const d = blogModal.data
  const close = () => setBlogModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title">{blogModal.mode === 'edit' ? 'Edit Post' : 'Add Blog Post'}</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="fg"><label className="fl">Post Title *</label><input className="fi" type="text" value={d.title || ''} onChange={e => setBlogData('title', e.target.value)} placeholder="e.g. Dubai Real Estate Market Update 2025" /></div>
          <div className="fr">
            <div className="fg">
              <label className="fl">Category</label>
              <select className="fi" value={d.cat || 'Market Update'} onChange={e => setBlogData('cat', e.target.value)}>
                <option>Market Update</option>
                <option>Buying Guide</option>
                <option>Investment</option>
                <option>Golden Visa</option>
                <option>NRI Guide</option>
                <option>Management</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Status</label>
              <select className="fi" value={d.status || 'Published'} onChange={e => setBlogData('status', e.target.value)}>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
          <div className="fg"><label className="fl">Short Description *</label><textarea className="fi" value={d.desc || ''} onChange={e => setBlogData('desc', e.target.value)} placeholder="Brief summary of the post..." /></div>
          <div className="fg"><label className="fl">Image URL</label><input className="fi" type="url" value={d.img || ''} onChange={e => setBlogData('img', e.target.value)} placeholder="https://example.com/image.jpg" /></div>
          <div className="fg"><label className="fl">Read Time</label><input className="fi" type="text" value={d.readTime || ''} onChange={e => setBlogData('readTime', e.target.value)} placeholder="e.g. 5 min read" /></div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={saveBlog}>💾 {blogModal.mode === 'edit' ? 'Update Post' : 'Publish Post'}</button>
        </div>
      </div>
    </div>
  )
}

function TeamModal({ teamModal, setTeamModal, setTeamData, saveTeam, teamPhoto, setTeamPhoto, teamPhotoShowUrl, setTeamPhotoShowUrl, teamPhotoUrlVal, setTeamPhotoUrlVal, teamFileInputRef, handleTeamPhotoUpload, addTeamPhotoUrl }) {
  const d = teamModal.data
  const close = () => setTeamModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title">{teamModal.mode === 'edit' ? 'Edit Member' : 'Add Team Member'}</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="fr">
            <div className="fg"><label className="fl">Full Name *</label><input className="fi" type="text" value={d.name || ''} onChange={e => setTeamData('name', e.target.value)} placeholder="e.g. Sarah Ahmed" /></div>
            <div className="fg"><label className="fl">Role *</label><input className="fi" type="text" value={d.role || ''} onChange={e => setTeamData('role', e.target.value)} placeholder="e.g. Senior Agent" /></div>
          </div>
          <div className="fr">
            <div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={d.email || ''} onChange={e => setTeamData('email', e.target.value)} placeholder="name@imaksa.com" /></div>
            <div className="fg"><label className="fl">Phone</label><input className="fi" type="text" value={d.phone || ''} onChange={e => setTeamData('phone', e.target.value)} placeholder="+971 50 000 0000" /></div>
          </div>
          <div className="fg"><label className="fl">Short Bio</label><textarea className="fi" value={d.bio || ''} onChange={e => setTeamData('bio', e.target.value)} placeholder="Brief professional bio..." /></div>
          <label className="fl" style={{marginBottom:8}}>Photo</label>
          <div className="img-upload-box">
            <div className="img-upload-actions">
              <button className="img-upload-btn" onClick={() => teamFileInputRef.current?.click()}>📁 Upload Photo</button>
              <input ref={teamFileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleTeamPhotoUpload} />
              <button className="btn-outline" style={{flex:1,padding:10,border:'1px solid var(--border2)',fontSize:11,letterSpacing:1,cursor:'pointer',background:'transparent',color:'var(--teal)',fontFamily:'Inter,sans-serif'}} onClick={() => setTeamPhotoShowUrl(v => !v)}>🔗 Add URL</button>
            </div>
            {teamPhotoShowUrl && (
              <div className="img-url-row">
                <input type="url" value={teamPhotoUrlVal} onChange={e => setTeamPhotoUrlVal(e.target.value)} placeholder="https://example.com/photo.jpg" onKeyDown={e => e.key === 'Enter' && addTeamPhotoUrl()} />
                <button onClick={addTeamPhotoUrl}>Add</button>
                <button onClick={() => { setTeamPhotoShowUrl(false); setTeamPhotoUrlVal('') }} style={{background:'var(--cream2)',color:'var(--text2)'}}>✕</button>
              </div>
            )}
            {teamPhoto && (
              <div style={{display:'flex',alignItems:'center',gap:10,marginTop:8}}>
                <div className="img-thumb-wrap" style={{width:80,height:80}}>
                  <img src={teamPhoto.src} alt="" onError={e => { e.target.style.display = 'none' }} style={{width:'100%',height:'100%',objectFit:'cover',border:'1px solid var(--border)',borderRadius:'50%'}} />
                  <button className="img-remove" onClick={() => setTeamPhoto(null)}>✕</button>
                </div>
                <span style={{fontSize:11,color:'var(--text3)'}}>Photo preview</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={saveTeam}>💾 {teamModal.mode === 'edit' ? 'Update Member' : 'Add Member'}</button>
        </div>
      </div>
    </div>
  )
}

function EnqModal({ enqModal, setEnqModal, fmtDate }) {
  const e = enqModal.data
  const close = () => setEnqModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={ev => ev.target === ev.currentTarget && close()}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title">Enquiry Details</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div><span className="di-label">Full Name</span><span className="di-val">{e.name}</span></div>
            <div><span className="di-label">Date</span><span className="di-val">{fmtDate(e.createdAt)}</span></div>
            <div><span className="di-label">Email</span><span className="di-val">{e.email || '—'}</span></div>
            <div><span className="di-label">Phone</span><span className="di-val">{e.phone || '—'}</span></div>
            <div><span className="di-label">Property Interest</span><span className="di-val">{e.interest || '—'}</span></div>
            <div><span className="di-label">Budget</span><span className="di-val">{e.budget || '—'}</span></div>
          </div>
          {e.message && <div className="detail-msg">{e.message}</div>}
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Close</button>
          {e.email && <a href={`mailto:${e.email}?subject=Re: Your Property Enquiry`} className="btn btn-primary">✉️ Reply via Email</a>}
        </div>
      </div>
    </div>
  )
}

function SellModal({ sellModal, setSellModal, fmtDate }) {
  const s = sellModal.data
  const close = () => setSellModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={ev => ev.target === ev.currentTarget && close()}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title">Sell Request Details</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div><span className="di-label">Full Name</span><span className="di-val">{s.name}</span></div>
            <div><span className="di-label">Date</span><span className="di-val">{fmtDate(s.createdAt)}</span></div>
            <div><span className="di-label">Email</span><span className="di-val">{s.email || '—'}</span></div>
            <div><span className="di-label">Phone</span><span className="di-val">{s.phone || '—'}</span></div>
            <div><span className="di-label">Property Type</span><span className="di-val">{s.propertyType || '—'}</span></div>
            <div><span className="di-label">Location</span><span className="di-val">{s.location || '—'}</span></div>
            <div><span className="di-label">Size</span><span className="di-val">{s.size ? `${s.size} sq.ft` : '—'}</span></div>
            <div><span className="di-label">Asking Price</span><span className="di-val">{s.askingPrice ? `AED ${s.askingPrice}` : '—'}</span></div>
          </div>
          {s.notes && <div className="detail-msg">{s.notes}</div>}
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Close</button>
          {s.email && <a href={`mailto:${s.email}?subject=Re: Your Property Listing Request`} className="btn btn-primary">✉️ Reply via Email</a>}
        </div>
      </div>
    </div>
  )
}

function PageJobs({ allJobs, setJobModal, deleteJob }) {
  return (
    <>
      <div className="sec-hdr">
        <div>
          <div className="sec-title">Job Listings</div>
          <div className="sec-sub">Manage open positions on your careers page</div>
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Type</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allJobs.length === 0 && (
              <tr><td colSpan="7"><div className="empty"><div className="empty-icon">💼</div><div className="empty-title">No job listings yet</div></div></td></tr>
            )}
            {allJobs.map(j => (
              <tr key={j._id}>
                <td><div className="tbl-name">{j.title}</div></td>
                <td>
                  {j.department
                    ? <span className="bdg bdg-buy">{j.department}</span>
                    : <span style={{color:'var(--text3)'}}>—</span>
                  }
                </td>
                <td style={{fontSize:12}}>{j.type || '—'}</td>
                <td style={{fontSize:12,color:'var(--text3)'}}>{j.location || '—'}</td>
                <td style={{fontSize:12}}>{j.salary || '—'}</td>
                <td>
                  <span className={`bdg ${j.active ? 'bdg-published' : 'bdg-draft'}`}>
                    {j.active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="tbl-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setJobModal({ open: true, mode: 'edit', data: { ...j } })}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteJob(j._id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function JobModal({ jobModal, setJobModal, setJobData, saveJob }) {
  const d = jobModal.data
  const close = () => setJobModal(m => ({ ...m, open: false }))
  return (
    <div className="modal-ov open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title">{jobModal.mode === 'edit' ? 'Edit Job' : 'Add Job Listing'}</div>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="fg"><label className="fl">Job Title *</label><input className="fi" type="text" value={d.title || ''} onChange={e => setJobData('title', e.target.value)} placeholder="e.g. Senior Property Consultant" /></div>
          <div className="fr">
            <div className="fg">
              <label className="fl">Department</label>
              <select className="fi" value={d.department || ''} onChange={e => setJobData('department', e.target.value)}>
                <option value="">Select Department</option>
                <option>Sales</option>
                <option>Investment</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>Other</option>
              </select>
            </div>
            <div className="fg">
              <label className="fl">Type</label>
              <select className="fi" value={d.type || 'Full-time'} onChange={e => setJobData('type', e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>
          <div className="fg"><label className="fl">Location</label><input className="fi" type="text" value={d.location || 'Dubai, UAE'} onChange={e => setJobData('location', e.target.value)} placeholder="e.g. Dubai, UAE" /></div>
          <div className="fg"><label className="fl">Salary / Package</label><input className="fi" type="text" value={d.salary || ''} onChange={e => setJobData('salary', e.target.value)} placeholder="e.g. Commission + Base, Competitive Package" /></div>
          <div className="fg"><label className="fl">Description</label><textarea className="fi" value={d.description || ''} onChange={e => setJobData('description', e.target.value)} placeholder="Job description and requirements..." /></div>
          <div className="fg">
            <label className="fl">Status</label>
            <select className="fi" value={d.active === false ? 'draft' : 'active'} onChange={e => setJobData('active', e.target.value === 'active')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-outline" onClick={close}>Cancel</button>
          <button className="btn btn-primary" onClick={saveJob}>💾 {jobModal.mode === 'edit' ? 'Update Job' : 'Add Job'}</button>
        </div>
      </div>
    </div>
  )
}
