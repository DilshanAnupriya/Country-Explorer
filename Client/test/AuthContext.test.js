import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import AuthContext from '../src/context/AuthContext.jsx';
import { useContext } from 'react';

// Mock axios
jest.mock('axios');

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
        localStorageMock.clear();
    });

    describe('Initial state', () => {
        test('should initialize with null user and empty favorites when no token exists', async () => {
            localStorageMock.getItem.mockReturnValueOnce(null); // token
            localStorageMock.getItem.mockReturnValueOnce(null); // favorites

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(screen.getByTestId('user').textContent).toBe('No user');
            expect(screen.getByTestId('loading').textContent).toBe('false');
            expect(screen.getByTestId('favorites').textContent).toBe('[]');
        });

        test('should initialize with user data when valid token exists', async () => {
            const mockUser = { id: 1, username: 'testuser' };
            const mockToken = 'valid-token';

            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return mockToken;
                if (key === 'favorites') return JSON.stringify([]);
                return null;
            });

            axios.get.mockResolvedValueOnce({ data: { User: mockUser } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/user/user-by');
                expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
            });
        });

        test('should clear token if user data fetch fails', async () => {
            const mockToken = 'invalid-token';

            localStorageMock.getItem.mockImplementation((key) => {
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
                expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
                expect(screen.getByTestId('user').textContent).toBe('No user');
            });
        });

        test('should restore favorites from localStorage', async () => {
            const mockFavorites = [{ name: 'Test Country', alpha3Code: 'TST' }];

            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return null;
                if (key === 'favorites') return JSON.stringify(mockFavorites);
                return null;
            });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(screen.getByTestId('favorites').textContent).toBe(JSON.stringify(mockFavorites));
        });
    });

    describe('Login functionality', () => {
        test('should update state after successful login', async () => {
            const mockUser = { id: 1, username: 'testuser' };
            const mockToken = 'new-token';

            axios.post.mockResolvedValueOnce({ data: { token: mockToken } });
            axios.get.mockResolvedValueOnce({ data: { User: mockUser } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await act(async () => {
                screen.getByTestId('login').click();
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/v1/user/login', {
                    username: 'testuser',
                    password: 'password',
                });
                expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
                expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
            });
        });

        test('should handle login failure', async () => {
            axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            let result;
            await act(async () => {
                result = await screen.getByTestId('login').click();
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalled();
                expect(screen.getByTestId('user').textContent).toBe('No user');
            });
        });
    });

    describe('Signup functionality', () => {
        test('should handle successful signup', async () => {
            const mockResponse = { success: true };

            axios.post.mockResolvedValueOnce({ data: mockResponse });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            let result;
            await act(async () => {
                result = await screen.getByTestId('signup').click();
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    'http://localhost:3000/api/v1/user/signup',
                    {
                        username: 'testuser',
                        email: 'test@example.com',
                        password: 'password',
                        role: ['User'],
                    }
                );
            });
        });

        test('should handle signup failure', async () => {
            axios.post.mockRejectedValueOnce({
                response: { data: { error: 'Username already exists' } }
            });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            await act(async () => {
                screen.getByTestId('signup').click();
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalled();
            });
        });
    });

    describe('Logout functionality', () => {
        test('should clear user data and token on logout', async () => {
            // Setup initial logged in state
            const mockUser = { id: 1, username: 'testuser' };
            const mockToken = 'valid-token';

            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return mockToken;
                return null;
            });

            axios.get.mockResolvedValueOnce({ data: { User: mockUser } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            // Verify logged in state
            await waitFor(() => {
                expect(screen.getByTestId('user').textContent).toBe(JSON.stringify(mockUser));
            });

            // Perform logout
            await act(async () => {
                screen.getByTestId('logout').click();
            });

            // Verify logged out state
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
            expect(screen.getByTestId('user').textContent).toBe('No user');
        });
    });

    describe('Favorites functionality', () => {
        test('should add country to favorites', async () => {
            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(screen.getByTestId('favorites').textContent).toBe('[]');

            await act(async () => {
                screen.getByTestId('add-favorite').click();
            });

            const expectedFavorite = [{ name: 'Test Country', alpha3Code: 'TST' }];
            expect(screen.getByTestId('favorites').textContent).toBe(JSON.stringify(expectedFavorite));
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'favorites',
                JSON.stringify(expectedFavorite)
            );
        });

        test('should remove country from favorites', async () => {
            const initialFavorites = [{ name: 'Test Country', alpha3Code: 'TST' }];

            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return null;
                if (key === 'favorites') return JSON.stringify(initialFavorites);
                return null;
            });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(screen.getByTestId('favorites').textContent).toBe(JSON.stringify(initialFavorites));

            await act(async () => {
                screen.getByTestId('remove-favorite').click();
            });

            expect(screen.getByTestId('favorites').textContent).toBe('[]');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]');
        });

        test('should check if country is in favorites', async () => {
            const initialFavorites = [{ name: 'Test Country', alpha3Code: 'TST' }];

            localStorageMock.getItem.mockImplementation((key) => {
                if (key === 'token') return null;
                if (key === 'favorites') return JSON.stringify(initialFavorites);
                return null;
            });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(screen.getByTestId('is-favorite').textContent).toBe('true');

            // Remove the favorite and check again
            await act(async () => {
                screen.getByTestId('remove-favorite').click();
            });

            expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        });
    });

    describe('Axios configuration', () => {
        test('should set Authorization header when token exists', async () => {
            const mockToken = 'test-token';
            localStorageMock.getItem.mockReturnValueOnce(mockToken);

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
        });

        test('should remove Authorization header when token is removed', async () => {
            const mockToken = 'test-token';
            localStorageMock.getItem.mockReturnValueOnce(mockToken);
            axios.get.mockResolvedValueOnce({ data: { User: { id: 1 } } });

            await act(async () => {
                render(
                    <AuthProvider>
                        <TestComponent />
                    </AuthProvider>
                );
            });

            expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);

            // Logout to remove token
            await act(async () => {
                screen.getByTestId('logout').click();
            });

            expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
        });
    });

    describe('authChecked state', () => {
        test('should set authChecked to true after initialization', async () => {
            // Create a custom test component to check authChecked
            const AuthCheckedTest = () => {
                const { authChecked } = useContext(AuthContext);
                return <div data-testid="auth-checked">{authChecked.toString()}</div>;
            };

            await act(async () => {
                render(
                    <AuthProvider>
                        <AuthCheckedTest />
                    </AuthProvider>
                );
            });

            await waitFor(() => {
                expect(screen.getByTestId('auth-checked').textContent).toBe('true');
            });
        });
    });
});