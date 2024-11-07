import axios from 'axios';
import type { PositionPlanesService } from './positionPlanesService';

// Função que faz a requisição POST
export const  sendCollisionCheck = async ({ positionPlaneService }: { positionPlaneService: PositionPlanesService }) => {
    try {

        const planes = positionPlaneService.getPlanes();
        console.log('Planes:', planes);
        const input = `Responda em português, com até 20 palavras. Estou monitorando dois aviões e preciso saber se eles irão colidir. Dados: ${planes.map((plane) => `Avião ${plane.id} na posição (${plane.x}, ${plane.y}), velocidade ${plane.velocity}, direção ${plane.direction}°`).join(', ')}. Responda 'colidem' ou 'não colidem', considerando que os aviões não precisam estar exatamente na mesma posição, apenas próximos.`;
        console.log('Input:', input);
        const response = await axios.post('http://localhost:3000/process-input', {
            input: input,
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        positionPlaneService.addTracking({
            tracking: [{
                distance: 0,
                message: `🤖${response.data.response}`,
                plane: []
            }]
        })

        console.log('Resposta do servidor:', response.data.response);
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
    }
}
