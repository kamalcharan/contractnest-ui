// src/pages/settings/index.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageSquare, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { getGroupedSettingsMetadata, GroupedSettingsMetadata } from '../../utils/constants/settingsMenus';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const { isDarkMode, currentTheme } = useTheme();
    
    // Get theme colors
    const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
    
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<GroupedSettingsMetadata>({});

    // Load settings from constants file
    useEffect(() => {
        setLoading(true);
        // Small timeout to simulate loading
        const timer = setTimeout(() => {
            // Get settings from constants file (false = for Configure page)
            const groupedSettings = getGroupedSettingsMetadata(false);
            setSettings(groupedSettings);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleCardClick = (route: string | null, cardName: string) => {
        if (route) {
            console.log('Card clicked with route:', route);
            console.log('Card name:', cardName);
            
            // Navigate to the route
            navigate(route);
        }
    };

    const getIcon = (iconName: string | null) => {
        if (!iconName) return null;
        const Icon = (Icons as any)[iconName?.trim()];
        return Icon ? <Icon className="h-4 w-4" /> : null;
    };

    // Admin status check
    const isAdmin = Boolean(currentTenant?.is_admin);

    if (loading) {
        return (
            <div 
                className="p-6 transition-colors duration-200 min-h-screen"
                style={{
                    background: isDarkMode 
                        ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
                        : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
                }}
            >
                <div className="space-y-8">
                    {[1, 2].map((group) => (
                        <div key={group} className="flex gap-8">
                            <div className="w-1/4">
                                <div 
                                    className="h-4 w-48 rounded animate-pulse"
                                    style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
                                />
                            </div>
                            <div className="w-3/4 space-y-4">
                                {[1, 2].map((card) => (
                                    <div 
                                        key={card} 
                                        className="h-24 rounded-lg animate-pulse"
                                        style={{ backgroundColor: colors.utility.primaryBackground + '80' }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Filter settings based on admin status
    const filteredSettings: GroupedSettingsMetadata = {};
    Object.entries(settings).forEach(([groupKey, { items }]) => {
        const filteredItems = items.filter(item => isAdmin || !item.adminOnly);
        if (filteredItems.length > 0) {
            filteredSettings[groupKey] = { items: filteredItems };
        }
    });

    return (
        <div 
            className="p-6 max-w-[1200px] mx-auto transition-colors duration-200 min-h-screen"
            style={{
                background: isDarkMode 
                    ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
                    : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 
                        className="text-2xl font-semibold transition-colors"
                        style={{ color: colors.utility.primaryText }}
                    >
                        Configure System
                    </h1>
                    <p 
                        className="mt-1 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                    >
                        Set up how you manage subscriptions, customers, billing, and more
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        className="p-2 rounded-full transition-colors hover:opacity-80"
                        style={{
                            backgroundColor: colors.utility.secondaryBackground + '80',
                            color: colors.brand.primary
                        }}
                    >
                        <HelpCircle className="h-5 w-5" />
                    </button>
                    <button 
                        className="p-2 rounded-full transition-colors hover:opacity-80"
                        style={{
                            backgroundColor: colors.utility.secondaryBackground + '80',
                            color: colors.brand.primary
                        }}
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Settings Groups */}
            <div className="flex flex-col">
                {Object.entries(filteredSettings).map(([groupKey, { items }]) => {
                    const groupParent = items.find(item => item.parent_type === null);
                    const childItems = items.filter(item => item.parent_type === groupKey);
                    
                    if (!groupParent || childItems.length === 0) return null;
                    
                    return (
                        <div key={groupKey} className="mt-16 first:mt-0">
                            <div className="flex gap-8">
                                {/* Left: Group Header with Description */}
                                <div className="w-1/4">
                                    <h2 
                                        className="text-xl font-medium transition-colors"
                                        style={{ color: colors.utility.primaryText }}
                                    >
                                        {groupKey}
                                    </h2>
                                    <p 
                                        className="mt-2 text-sm transition-colors"
                                        style={{ color: colors.utility.secondaryText }}
                                    >
                                        {groupParent?.description_long || ''}
                                    </p>
                                </div>

                                {/* Right: Cards Stack */}
                                <div className="w-3/4 flex flex-col space-y-2">
                                    {childItems.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleCardClick(item.route_path, item.settings_type)}
                                            className="hover:shadow-md transition-all duration-200 cursor-pointer rounded-lg border p-4"
                                            style={{
                                                borderColor: colors.utility.primaryText + '20',
                                                backgroundColor: colors.utility.secondaryBackground
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {/* Icon Circle */}
                                                    <div 
                                                        className="p-1.5 rounded-lg flex items-center justify-center w-7 h-7"
                                                        style={{
                                                            background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                                                            color: '#FFFFFF'
                                                        }}
                                                    >
                                                        {getIcon(item.card_icon_name)}
                                                    </div>
                                            
                                                    {/* Text Content */}
                                                    <div className="flex flex-col">
                                                        <h3 
                                                            className="font-medium text-base leading-tight transition-colors"
                                                            style={{ color: colors.utility.primaryText }}
                                                        >
                                                            {item.settings_type}
                                                        </h3>
                                                        <p 
                                                            className="text-xs leading-tight mt-1 transition-colors"
                                                            style={{ color: colors.utility.secondaryText }}
                                                        >
                                                            {item.description_long}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Arrow Icon */}
                                                <Icons.ChevronRight 
                                                    className="h-4 w-4 transition-colors" 
                                                    style={{ color: colors.utility.secondaryText }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingsPage;