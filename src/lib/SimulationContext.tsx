'use client';

import React, { createContext, useContext, useState } from 'react';

interface SimulationContextType {
    savingPercent: number;
    setSavingPercent: (val: number) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
    const [savingPercent, setSavingPercent] = useState(0);

    return (
        <SimulationContext.Provider value={{ savingPercent, setSavingPercent }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
}
