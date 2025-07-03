import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Query keys for better organization
export const QUERY_KEYS = {
  users: {
    all: () => ['users'] as const,
    list: (filters?: any) => ['users', filters] as const,
    detail: (id: number) => ['users', id] as const,
    stats: () => ['users', 'stats'] as const,
  },
  roles: {
    all: () => ['roles'] as const,
    list: (filters?: any) => ['roles', filters] as const,
    detail: (id: number) => ['roles', id] as const,
    stats: () => ['roles', 'stats'] as const,
  }
};

/**
 * Custom hook for managing data synchronization between users and roles
 * This ensures that when user data changes, related role statistics are updated
 */
export const useDataSync = () => {
  const queryClient = useQueryClient();

  // Invalidate all user-related queries
  const invalidateUsers = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all() });
  }, [queryClient]);

  // Invalidate all role-related queries
  const invalidateRoles = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all() });
  }, [queryClient]);

  // Invalidate role statistics (important for user count per role)
  const invalidateRoleStats = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.stats() });
  }, [queryClient]);

  // Invalidate user statistics
  const invalidateUserStats = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.stats() });
  }, [queryClient]);

  // Comprehensive sync when user data changes (especially role changes)
  const syncUserChanges = useCallback(() => {
    console.log('🔄 Syncing user changes - invalidating related data...');
    invalidateUsers();
    invalidateRoleStats(); // Critical: update role user counts
    invalidateUserStats();
  }, [invalidateUsers, invalidateRoleStats, invalidateUserStats]);

  // Sync when role data changes
  const syncRoleChanges = useCallback(() => {
    console.log('🔄 Syncing role changes - invalidating related data...');
    invalidateRoles();
    invalidateUsers(); // Users might be affected by role permission changes
  }, [invalidateRoles, invalidateUsers]);

  // Force refresh all data (for manual refresh scenarios)
  const forceRefreshAll = useCallback(() => {
    console.log('🔄 Force refreshing all data...');
    queryClient.invalidateQueries();
  }, [queryClient]);

  // Optimistic update for user role change
  const optimisticUpdateUserRole = useCallback((userId: number, newRole: string) => {
    // Update user data optimistically
    queryClient.setQueryData(QUERY_KEYS.users.detail(userId), (oldData: any) => {
      if (oldData) {
        return { ...oldData, role: newRole };
      }
      return oldData;
    });

    // Update user list optimistically
    queryClient.setQueriesData({ queryKey: QUERY_KEYS.users.all() }, (oldData: any) => {
      if (oldData?.data) {
        const updatedUsers = oldData.data.map((user: any) =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        return { ...oldData, data: updatedUsers };
      }
      return oldData;
    });

    // Schedule role stats refresh after optimistic update
    setTimeout(() => {
      invalidateRoleStats();
    }, 100);
  }, [queryClient, invalidateRoleStats]);

  return {
    // Query keys for consistent usage
    QUERY_KEYS,
    
    // Individual invalidation functions
    invalidateUsers,
    invalidateRoles,
    invalidateRoleStats,
    invalidateUserStats,
    
    // Comprehensive sync functions
    syncUserChanges,
    syncRoleChanges,
    forceRefreshAll,
    
    // Optimistic updates
    optimisticUpdateUserRole,
    
    // Direct query client access for advanced usage
    queryClient,
  };
}; 