import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';

/**
 * Renders a component with the providers screens rely on, without retries.
 * `render` is asynchronous in React Native Testing Library 14.
 */
export async function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper });
}

/** Minimal stand-in for the navigation prop a screen receives. */
export const createNavigationMock = () =>
  ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    getParent: jest.fn(() => ({ navigate: jest.fn() })),
  }) as never;
