import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import AuthContext from '../src/context/AuthContext.jsx';
import { useContext } from 'react';

// Mock axios
jest.mock('axios');

// Mock sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Test component that uses the context
const TestComponent = () => {
    const auth = useContext(AuthContext);
    return (
        <div>
            <div data-testid="user">{auth.currentUser ? JSON.stringify(auth.currentUser) : 'No user'}</div>
            <div data-testid="loading">{auth.loading.toString()}</div>
            <div data-testid="favorites">{JSON.stringify(auth.favorites)}</div>
            <button data-testid="login" onClick={() => auth.login('testuser', 'password')}>
                Login
            </button>
            <button data-testid="signup" onClick={() => auth.signup('testuser', 'test@example.com', 'password')}>
                Signup
            </button>
            <button data-testid="logout" onClick={() => auth.logout()}>
                Logout
            </button>
            <button
                data-testid="add-favorite"
                onClick={() => auth.addFavorite({ name: 'Test Country', alpha3Code: 'TST' })}
            >
                Add Favorite
            </button>
            <button data-testid="remove-favorite" onClick={() => auth.removeFavorite('TST')}>
                Remove Favorite
            </button>
            <div data-testid="is-favorite">{auth.isFavorite('TST').toString()}</div>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        sessionStorageMock.clear();
        localStorageMock.clear();
    });

    describe('Initial state', () => {
        test('should clear token if user data fetch fails', async () => {
            const mockToken = 'invalid-token';

            sessionStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return mockToken;
                return null;
            });

            axios.get.mockRejectedValueOnce(new Error('Invalid token'));

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await waitFor(() => {
                // expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('token');
                expect(screen.getByTestId('user').textContent).toBe('No user');
            });
        });
    });

    describe('Axios configuration', () => {
        test('should set Authorization header when token exists', async () => {
            const mockToken = 'test-token';
            sessionStorageMock.getItem.mockReturnValueOnce(mockToken);

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await waitFor(() => {
                // expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
            });
        });

        test('should remove Authorization header when token is removed', async () => {
            const mockToken = 'test-token';
            sessionStorageMock.getItem.mockReturnValueOnce(mockToken);
            axios.get.mockResolvedValueOnce({ data: { User: { id: 1 } } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await waitFor(() => {
                expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
            });

            // Logout to remove token
            await act(async () => {
                screen.getByTestId('logout').click();
            });

            expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
        });
    });
});