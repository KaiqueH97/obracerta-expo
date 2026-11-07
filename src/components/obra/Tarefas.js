import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Botao, Campo, Paginacao, estilos, itensPagina, novoId } from './ui';

export default function Tarefas({ tarefas, salvar, ocupado }) {
  const [nome, setNome] = useState('');
  const [pagina, setPagina] = useState(0);
  return <View style={estilos.painel}>
    <Text accessibilityRole="header" style={estilos.titulo}>Checklist da Obra</Text>
    <Campo titulo="O que precisa ser feito?" value={nome} onChangeText={setNome} disabled={ocupado} />
    <Botao texto="Adicionar tarefa" disabled={ocupado || !nome.trim()} onPress={async () => {
      if (await salvar('tarefas', [{ id: novoId(), nome: nome.trim(), concluida: false }, ...tarefas])) { setNome(''); setPagina(0); }
    }} />
    {!tarefas.length && <Text style={estilos.texto}>Sua lista está vazia.</Text>}
    {itensPagina(tarefas, pagina).map(item => <TouchableOpacity key={item.id} accessibilityRole="checkbox"
      accessibilityState={{ checked: item.concluida, disabled: ocupado }} disabled={ocupado} style={estilos.item}
      onPress={() => salvar('tarefas', tarefas.map(atual => atual.id === item.id ? { ...atual, concluida: !atual.concluida } : atual))}>
      <Text style={[estilos.texto, item.concluida && { textDecorationLine: 'line-through', color: '#047857' }]}>
        {item.concluida ? '☑' : '☐'} {item.nome}
      </Text>
    </TouchableOpacity>)}
    <Paginacao total={tarefas.length} pagina={pagina} onChange={setPagina} disabled={ocupado} />
  </View>;
}
