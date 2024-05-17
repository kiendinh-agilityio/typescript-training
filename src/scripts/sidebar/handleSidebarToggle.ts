export const handleSidebarToggle = (): void => {
  const sidebar: HTMLElement | null = document.getElementById('sidebar');
  const openBtn: HTMLElement | null = document.getElementById('open-btn');
  const closeBtn: HTMLElement | null = document.getElementById('close-btn');

  const toggleSidebar = (): void => {
    sidebar.classList.toggle('flex');
    openBtn.classList.toggle('hidden');
    closeBtn.classList.toggle('hidden');
  };

  openBtn.addEventListener('click', toggleSidebar);
  closeBtn.addEventListener('click', toggleSidebar);

  sidebar.addEventListener('click', (event: Event) => {
    if (event.target === sidebar) {
      toggleSidebar();
    }
  });
};
