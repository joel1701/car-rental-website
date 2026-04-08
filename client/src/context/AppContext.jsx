import React, { useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    const [token, setToken] = React.useState(() => localStorage.getItem('token'));
    const [user, setUser] = React.useState(null);
    const [isUserLoading, setIsUserLoading] = React.useState(() => Boolean(localStorage.getItem('token')));
    const [isOwner, setIsOwner] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);
    const [pickupDate, setPickupDate] = React.useState('');
    const [returnDate, setReturnDate] = React.useState('');
    const [cars, setCars] = React.useState([]);

    // Fetch user data
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch all cars
    const fetchCars = async () => {
        try {
            const { data } = await axios.get('/user/cars');
            data.success ? setCars(data.cars) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch available cars (public)
    const fetchAvailableCars = async () => {
        try {
            const { data } = await axios.get('/user/available-cars');
            data.success ? setCars(data.cars) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success('Logged out successfully');
    };

    // Set token + fetch user
    useEffect(() => {
        const initializeAuthData = async () => {
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setIsUserLoading(true);
                setUser(null);
                setIsOwner(false);
                await Promise.allSettled([fetchUser(), fetchCars()]);
                setIsUserLoading(false);
            } else {
                axios.defaults.headers.common['Authorization'] = '';
                setIsUserLoading(false);
                setUser(null);
                setIsOwner(false);
                await fetchAvailableCars();
            }
        };

        initializeAuthData();
    }, [token]);

    const value = {
        navigate,
        currency,
        token,
        setToken,
        user,
        setUser,
        isUserLoading,
        isOwner,
        setIsOwner,
        showLogin,
        setShowLogin,
        axios,
        fetchUser,
        logout,
        fetchCars,
        cars,
        setCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};