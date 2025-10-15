import React, { useState } from 'react';

interface SecurityEvent {
    id: string;
    type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_breach' | 'system_error';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    userId?: string;
    userName?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    status: 'resolved' | 'investigating' | 'pending';
}

interface SecurityAlert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    status: 'active' | 'resolved' | 'dismissed';
}

export const SecurityDashboard: React.FC = () => {
    const [events, setEvents] = useState<SecurityEvent[]>([
        {
            id: '1',
            type: 'failed_login',
            severity: 'medium',
            description: 'Multiple failed login attempts from IP 192.168.1.100',
            userId: 'user_1',
            userName: 'John Doe',
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'investigating'
        },
        {
            id: '2',
            type: 'suspicious_activity',
            severity: 'high',
            description: 'Unusual API usage pattern detected',
            userId: 'user_2',
            userName: 'Jane Smith',
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'pending'
        },
        {
            id: '3',
            type: 'login',
            severity: 'low',
            description: 'Successful login from new device',
            userId: 'user_3',
            userName: 'Mike Johnson',
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
            timestamp: '2024-01-15T08:45:00Z',
            status: 'resolved'
        }
    ]);

    const [alerts, setAlerts] = useState<SecurityAlert[]>([
        {
            id: '1',
            title: 'High API Usage Detected',
            description: 'User jane@example.com has made 1000+ requests in the last hour',
            severity: 'high',
            timestamp: '2024-01-15T10:30:00Z',
            status: 'active'
        },
        {
            id: '2',
            title: 'Suspicious IP Activity',
            description: 'Multiple failed login attempts from IP 192.168.1.100',
            severity: 'medium',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'active'
        },
        {
            id: '3',
            title: 'System Performance Degradation',
            description: 'Response times have increased by 200% in the last 30 minutes',
            severity: 'critical',
            timestamp: '2024-01-15T08:45:00Z',
            status: 'resolved'
        }
    ]);

    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredEvents = events.filter(event => {
        const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
        const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
        return matchesSeverity && matchesStatus;
    });

    const getSeverityBadge = (severity: string) => {
        const styles = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[severity as keyof typeof styles]}`}>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            resolved: 'bg-green-100 text-green-800',
            investigating: 'bg-yellow-100 text-yellow-800',
            pending: 'bg-red-100 text-red-800',
            active: 'bg-red-100 text-red-800',
            dismissed: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getEventIcon = (type: SecurityEvent['type']) => {
        const icons = {
            login: (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            ),
            logout: (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            ),
            failed_login: (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            suspicious_activity: (
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            data_breach: (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            system_error: (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        };
        return icons[type];
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
                <p className="text-gray-600">Monitor security events and system health</p>
            </div>

            {/* Security Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {alerts.filter(a => a.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Investigating</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {events.filter(e => e.status === 'investigating').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                            <p className="text-2xl font-semibold text-gray-900">8</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">System Health</p>
                            <p className="text-2xl font-semibold text-gray-900">98.5%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0">
                                    {getSeverityBadge(alert.severity)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    {getStatusBadge(alert.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Security Events */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Security Events</h2>
                        <div className="flex space-x-4">
                            <select
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Severity</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="resolved">Resolved</option>
                                <option value="investigating">Investigating</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 mr-3">
                                                {getEventIcon(event.type)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </div>
                                                <div className="text-sm text-gray-500">{event.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getSeverityBadge(event.severity)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.userName || 'System'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {event.ipAddress}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(event.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
