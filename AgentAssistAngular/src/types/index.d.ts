export {};

declare global {
  interface Window {
    _agentAssisteventListenerAdded: any;
    _agentAssistSocketEventListener : boolean;
  }
}