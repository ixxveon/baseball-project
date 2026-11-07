import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout(): React.JSX.Element {
    return (
        <div className="dashboard-container">
            <Header />
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
}
