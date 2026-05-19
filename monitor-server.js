/**
 * Monitor de Treinamento Full-Time (Frontend)
 */
async function verificarStatusServidor() {
    try {
        const response = await fetch('/api/admin/treinamento/status');
        const status = await response.json();
        
        const badge = document.getElementById('headerAiStatus');
        const badgeText = document.getElementById('headerAiText');
        
        if (status.ativo) {
            badge.className = 'ai-badge learning hidden md:flex bg-red-600 animate-pulse';
            badgeText.textContent = 'IA Full-Time G' + status.geracao;
        }
    } catch (e) {
        console.log("Servidor offline ou sem suporte a background training");
    }
}

// Verificar a cada 30 segundos
setInterval(verificarStatusServidor, 30000);
window.addEventListener('load', verificarStatusServidor);

async function toggleFullTime() {
    const response = await fetch('/api/admin/treinamento/status');
    const status = await response.json();
    
    const action = status.ativo ? 'parar' : 'iniciar';
    const res = await fetch(`/api/admin/treinamento/${action}`, { method: 'POST' });
    const data = await res.json();
    
    showToast(data.mensagem, status.ativo ? 'info' : 'success');
    verificarStatusServidor();
}
