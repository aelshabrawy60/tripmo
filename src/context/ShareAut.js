// app/context/SharedContext.tsx
'use client';

import { createContext, useContext } from 'react';

export const SharedContext = createContext({ groupId: null, role: null });

export const useSharedContext = () => useContext(SharedContext);
