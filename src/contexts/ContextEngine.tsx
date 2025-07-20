// src/context/ContextEngine.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types of context we'll track
export type ContextType = 'contract' | 'appointment' | 'contact' | 'marketplace';
export type UserExpertiseLevel = 'beginner' | 'intermediate' | 'advanced';
export type UserRole = 'provider' | 'consumer' | 'administrator';

interface ContextState {
  currentContext: ContextType;
  entityId?: string;
  userExpertise: UserExpertiseLevel;
  userRole: UserRole;
  recentActions: string[];
  previousContexts: ContextType[];
}

interface ContextEngineContextType {
  contextState: ContextState;
  setContext: (type: ContextType, entityId?: string) => void;
  addAction: (action: string) => void;
  setUserExpertise: (level: UserExpertiseLevel) => void;
  setUserRole: (role: UserRole) => void;
}

const defaultContextState: ContextState = {
  currentContext: 'contract',
  userExpertise: 'intermediate',
  userRole: 'administrator',
  recentActions: [],
  previousContexts: []
};

const ContextEngineContext = createContext<ContextEngineContextType | undefined>(undefined);