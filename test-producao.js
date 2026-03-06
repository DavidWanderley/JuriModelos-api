const axios = require('axios');

const testarProducao = async () => {
  const email = 'davidgomeswanderley@gmail.com';
  const API_URL = 'https://jurimodelos-api.onrender.com/api';
  
  console.log('🧪 Testando recuperação de senha em PRODUÇÃO\n');
  console.log(`📧 Email: ${email}`);
  console.log(`🌐 API: ${API_URL}\n`);
  
  const inicio = Date.now();
  
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, 
      { email },
      { timeout: 30000 }
    );
    
    const tempo = ((Date.now() - inicio) / 1000).toFixed(2);
    
    console.log(`✅ Sucesso! Tempo: ${tempo}s`);
    console.log(`📬 Status: ${response.status}`);
    console.log(`📄 Resposta:`, response.data);
    console.log('\n📧 Verifique a caixa de entrada e SPAM de:', email);
    
  } catch (error) {
    const tempo = ((Date.now() - inicio) / 1000).toFixed(2);
    
    console.error(`❌ Erro após ${tempo}s`);
    console.error(`📛 Status: ${error.response?.status}`);
    console.error(`📄 Resposta:`, error.response?.data);
    
    if (error.response?.status === 200) {
      console.log('\n✅ Status 200 = Email enviado (se cadastrado)');
      console.log('📧 Verifique SPAM e caixa de entrada');
    }
  }
};

testarProducao();
