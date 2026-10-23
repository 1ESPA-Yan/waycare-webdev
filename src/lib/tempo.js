// Datas vindas do Supabase (ISO, em UTC) mostradas no fuso da dock

const FUSO = 'America/Sao_Paulo'

// "agora há pouco", "há 5 min", "há 2 h", "há 3 dias"
export function tempoDesde(iso) {
  if (!iso) return ''
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'agora há pouco'
  if (min < 60) return `há ${min} min`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `há ${horas} h`
  const dias = Math.floor(horas / 24)
  return `há ${dias} dia${dias > 1 ? 's' : ''}`
}

// "14:05"
export function horaCurta(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: FUSO })
}
