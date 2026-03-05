const axios = require('axios');

// Validar formato de CEP
const validarCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return /^[0-9]{8}$/.test(cepLimpo);
};

// Buscar CEP via ViaCEP
exports.buscarCep = async (req, res) => {
  try {
    const { cep } = req.params;

    // Validar formato do CEP
    if (!validarCEP(cep)) {
      return res.status(400).json({ 
        message: 'CEP inválido. Deve conter 8 dígitos.' 
      });
    }

    const cepLimpo = cep.replace(/\D/g, '');

    // Fazer requisição para ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'JuriModelos-API'
      }
    });

    // Verificar se o CEP foi encontrado
    if (response.data.erro) {
      return res.status(404).json({ 
        message: 'CEP não encontrado.' 
      });
    }

    // Retornar dados do endereço
    return res.status(200).json({
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      complemento: response.data.complemento,
      bairro: response.data.bairro,
      localidade: response.data.localidade,
      uf: response.data.uf,
      ibge: response.data.ibge,
      gia: response.data.gia,
      ddd: response.data.ddd,
      siafi: response.data.siafi
    });

  } catch (error) {
    console.error('Erro ao buscar CEP:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        message: 'Timeout ao buscar CEP. Tente novamente.' 
      });
    }

    return res.status(500).json({ 
      message: 'Erro ao buscar CEP. Tente novamente mais tarde.' 
    });
  }
};
