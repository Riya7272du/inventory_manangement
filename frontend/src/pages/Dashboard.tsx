import React from 'react';

interface User {
    name: string;
    email: string;
    role: string;
}

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    return (
        <div>

        </div>
    );
};

export default Dashboard;