import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
//importing components
import DropdownMenu from '../shared/DropdownMenu';
import DrawerRight from './DrawerRight';
import TooltipCustom from '../shared/TooltipCustom';
import { toastInfo } from '../shared/toastInfo';
//importing material-ui
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
//importing material-ui-icons
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//importing styles
import './ChatHeader.css';

function ChatHeader( { roomCreatedBy, roomOwner, roomName, roomId, messages, db, history }) {
    const [{ user }] = useStateValue();
    const [drawerRight, setDrawerRight] = useState(false);
    const [menuChat, setMenuChat] = useState(null);
    const [role, setRole] = useState("");
    const [showDate, setShowDate] = useState(false);
    const [isLastMessage, setIsLastMessage] = useState(false);
    
    useEffect(() => {
        const errorAbout = "errorAbout";
        if(user.uid) {
          db.collection("users")
            .doc(user.uid)
            .get().then(function(doc) {
                if (doc.exists) {
                    setRole(doc.data().role)
                } 
          }).catch(function(error) {
                toastInfo(`${error}`, errorAbout, "top-center");
          });  
        }

        if(messages[messages.length-1]?.timestamp){
            setShowDate(true);
        }else{
            setShowDate(false);
        }

        if(messages[messages.length-1]){
            setIsLastMessage(true);
        }else{
            setIsLastMessage(false);
        }

    }, [user.uid, user.displayName, user.isAnonymous, db, messages]);

    const getDateFromMessage = () => {
        return (new Date(messages[messages.length-1]?.timestamp?.toDate()).toLocaleTimeString([], { 
            weekday: "long",
            year: "numeric",
            month:"long",
            day:"numeric",
            hour: 'numeric', 
            hour12: true, 
            minute: 'numeric'
        }))
    }

    const getDateLocal = () => {
        return (new Date().toLocaleTimeString([], { 
            weekday: "long",
            year: "numeric",
            month:"long",
            day:"numeric",
            hour: 'numeric', 
            hour12: true, 
            minute: 'numeric'
        }))
    }
    
    const searchMessage = () => {
        setDrawerRight(true);
    }

    const contactInfo = () => {
        const contactInfo = "contactInfo";
        toastInfo("Contact Info is not yet available!", contactInfo, "top-center");
    }

    const selectMessages = () => {
        const selectMessages = "selectMessages";
        toastInfo("Select Messages is not yet  available!", selectMessages, "top-center");
    }

    const muteNotifications = () => {
        const muteNotifications = "muteNotifications";
        toastInfo("Mute Notifications is not yet available!", muteNotifications, "top-center");
    }

    const clearMessages = () => {
        const clearMessages = "clearMessages";
        toastInfo("Clear Messages is not yet available!", clearMessages, "top-center");
    }

    const deleteRoom = () => {
        const roomDeleted = "roomDeleted";

        if(roomOwner===user.uid || role==="admin"){
            db.collection("rooms")
            .doc(roomId)
            .delete().then(function() {
                toastInfo("Room successfully deleted!", roomDeleted, "top-center");

            }).catch(function(error) {
                toastInfo(`Error removing room! ${error}`, roomDeleted, "top-center");
            });
            history.push('/');
        }else{
            toastInfo(`You are not allowed to delete room ${roomName}. Only the admin or room owner ${roomCreatedBy}`, roomDeleted, "top-center");
        }
    }

    const handleMenuClose = () => {
        setMenuChat(null);
    };

    const handleMenuOpen = (event) => {
        setMenuChat(event.currentTarget);
    };

    const menuChatLists = [
        {
            title: "Contact info",
            onClick: () => contactInfo(),
            id: Math.random()*100000,
        },
        {
            title: "Select messages",
            onClick: () => selectMessages(),
            id: Math.random()*100000,
        },
        {
            title: "Mute notifications",
            onClick: () => muteNotifications(),
            id: Math.random()*100000,
        },
        {
            title: "Clear messages",
            onClick: () => clearMessages(),
            id: Math.random()*100000,
        },
        {
            title: "Delete Room",
            onClick: () => deleteRoom(),
            id: Math.random()*100000,
        },
    ]

    return (
        <div className="chat__header">
            <DrawerRight 
                drawerRight={drawerRight} 
                setDrawerRight={setDrawerRight}
                roomId={roomId}
                messages={messages}
                db={db}
                user={user}
            />  

            <Hidden smUp>
                <Link to='/'>
                    <div className="chat__back_button">
                        <IconButton>
                            <ArrowBackIcon /> 
                        </IconButton>
                    </div>
                </Link>
            </Hidden>
            
            <Avatar>{roomName[0]}</Avatar>
            <div className="chat__headerInfo">
                <h3>{roomName}</h3>
                <Hidden only={['xs']}>
                    {/* <p>
                        {showDate? <>Last seen {" "} </>: null}
                        {showDate? 
                            (new Date(messages[messages.length-1].timestamp.toDate()).toLocaleTimeString([], { 
                                weekday: "long",
                                year: "numeric",
                                month:"long",
                                day:"numeric",
                                hour: 'numeric', 
                                hour12: true, 
                                minute: 'numeric'
                            }))
                            :
                            (new Date().toLocaleTimeString([], { 
                                weekday: "long",
                                year: "numeric",
                                month:"long",
                                day:"numeric",
                                hour: 'numeric', 
                                hour12: true, 
                                minute: 'numeric'
                            }))
                        }
                    </p> */}
                    
                        {isLastMessage?
                            <>
                                {showDate?
                                  <p>Last seen {" "} {getDateFromMessage()}</p>
                                  :
                                  <p>Last seen {" "} {getDateLocal()}</p>
                                }
                            </>
                        :null}
                    
                </Hidden>
            </div>
            
            <div className="chat__headerRight">
                <TooltipCustom 
                    name="Search" 
                    icon={<SearchOutlinedIcon/>} 
                    onClick={searchMessage}
                />
                <TooltipCustom 
                    name="Menu" 
                    icon={<MoreVertIcon />} 
                    onClick={handleMenuOpen}
                />
                <DropdownMenu 
                    menuLists={menuChatLists} 
                    menu={menuChat}
                    handleMenuOpen={handleMenuOpen}
                    handleMenuClose={handleMenuClose}
                />
            </div>
        </div>
    )
}

export default ChatHeader
