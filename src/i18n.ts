import { ref, watch } from 'vue'

export type Locale = 'zh' | 'en'

const messages = {
  zh: {
    'app.subtitle': '芯片寄存器位计算工具',
    'app.footer': '基于 Vue 3 + Tailwind CSS 构建',
    'app.language': '语言',

    'bitGrid.clear': '清空',
    'bitGrid.bitsView': '位视图',
    'bitGrid.hint': '左键拖拽翻转位值，右键拖拽管理分组。',
    'bitGrid.set': '置位',
    'bitGrid.clr': '清零',

    'value.attributes': '属性配置',
    'value.projectMode': '项目模式',
    'value.bitSize': '修改寄存器位宽',
    'value.bitsUnit': '{n} 位',
    'value.custom': '自定义:',
    'value.hex': 'HEX（16 进制）',
    'value.dec': 'DEC（10 进制）',
    'value.bin': 'BIN（2 进制）',
    'value.oct': 'OCT（8 进制）',
    'value.littleEndian': '小端序',
    'value.bigEndian': '大端序',
    'value.width': '位宽：{n} 位',

    'config.title': '配置管理',
    'config.copyJson': '复制 JSON',
    'config.saveFile': '保存文件',
    'config.import': '导入配置',
    'config.chooseFile': '选择文件',
    'config.pasteTitle': '粘贴 JSON 配置',
    'config.pastePlaceholder': '在此粘贴 {"bitSize": 32, ...}',
    'config.cancel': '取消',
    'config.confirmImport': '确认导入',
    'config.copied': '配置已复制到剪切板！',
    'config.imported': '配置导入成功！',
    'config.fileImported': '文件导入成功！',

    'group.title': '位分组',
    'group.empty': '在位网格上拖拽来创建分组。',
    'group.namePlaceholder': '分组名称',
    'group.editMappings': '配置备注规则',
    'group.delete': '删除分组',
    'group.defaultName': '分组 {n}',
    'group.bits': '{n} 位',
    'group.mappings': '备注规则',
    'group.addMapping': '+ 新增规则',
    'group.typeEqual': '数值等于',
    'group.typeBit': '位置位(1)',
    'group.valuePlaceholder': '如 0x1',
    'group.bitPlaceholder': '位偏移(如 0)',
    'group.labelPlaceholder': '显示备注',
    'group.invalidMapping': '无效的映射值',

    'project.title': '项目资源',
    'project.modeProject': '项目',
    'project.modeSimple': '简单',
    'project.simpleHint1': '简单模式',
    'project.simpleHint2': '操作默认寄存器',
    'project.addRegister': '添加寄存器',
    'project.regNamePlaceholder': '寄存器名称...',
    'project.regAddrPlaceholder': '地址(如 0x00)',
    'project.cancel': '取消',
    'project.done': '完成',
    'project.addChip': '+ 添加新芯片',
    'project.chipNamePlaceholder': '输入芯片名称...',
    'project.currentTarget': '当前目标',

    'error.groupOverlap': '分组位范围不能重叠！',
    'error.importFailed': '导入失败',
  },
  en: {
    'app.subtitle': 'Chip register bit calculator',
    'app.footer': 'Built with Vue 3 + Tailwind CSS',
    'app.language': 'Language',

    'bitGrid.clear': 'Clear',
    'bitGrid.bitsView': 'Bits View',
    'bitGrid.hint': 'Left-drag to flip bits, right-drag to manage groups.',
    'bitGrid.set': 'Set',
    'bitGrid.clr': 'Clr',

    'value.attributes': 'Attributes',
    'value.projectMode': 'Project Mode',
    'value.bitSize': 'Register Bit Size',
    'value.bitsUnit': '{n}-bit',
    'value.custom': 'Custom:',
    'value.hex': 'HEX (Hexadecimal)',
    'value.dec': 'DEC (Decimal)',
    'value.bin': 'BIN (Binary)',
    'value.oct': 'OCT (Octal)',
    'value.littleEndian': 'Little Endian',
    'value.bigEndian': 'Big Endian',
    'value.width': 'Width: {n} bits',

    'config.title': 'Config',
    'config.copyJson': 'Copy JSON',
    'config.saveFile': 'Save File',
    'config.import': 'Import',
    'config.chooseFile': 'Choose File',
    'config.pasteTitle': 'Paste JSON Config',
    'config.pastePlaceholder': 'Paste {"bitSize": 32, ...} here',
    'config.cancel': 'Cancel',
    'config.confirmImport': 'Import',
    'config.copied': 'Config copied to clipboard!',
    'config.imported': 'Config imported successfully!',
    'config.fileImported': 'File imported successfully!',

    'group.title': 'Bit Groups',
    'group.empty': 'Drag on the bit grid to create groups.',
    'group.namePlaceholder': 'Group name',
    'group.editMappings': 'Edit mapping rules',
    'group.delete': 'Delete group',
    'group.defaultName': 'Group {n}',
    'group.bits': '{n} bits',
    'group.mappings': 'Mappings',
    'group.addMapping': '+ Add rule',
    'group.typeEqual': 'Value equals',
    'group.typeBit': 'Bit set (1)',
    'group.valuePlaceholder': 'e.g. 0x1',
    'group.bitPlaceholder': 'Bit offset (e.g. 0)',
    'group.labelPlaceholder': 'Display label',
    'group.invalidMapping': 'Invalid mapping value',

    'project.title': 'Project',
    'project.modeProject': 'PROJECT',
    'project.modeSimple': 'SIMPLE',
    'project.simpleHint1': 'SIMPLE mode',
    'project.simpleHint2': 'Editing the default register',
    'project.addRegister': 'Add register',
    'project.regNamePlaceholder': 'Register name...',
    'project.regAddrPlaceholder': 'Address (e.g. 0x00)',
    'project.cancel': 'Cancel',
    'project.done': 'Done',
    'project.addChip': '+ Add New Chip',
    'project.chipNamePlaceholder': 'Chip name...',
    'project.currentTarget': 'Current Target',

    'error.groupOverlap': 'Group bit ranges cannot overlap!',
    'error.importFailed': 'Import failed',
  },
} as const

export type MessageKey = keyof typeof messages.zh

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]

const STORAGE_KEY = 'chip-register-calculator.locale'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  const lang = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  return lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const locale = ref<Locale>(detectLocale())

function applyDocumentLocale(l: Locale) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en'
  document.title = l === 'zh' ? '芯片寄存器计算器' : 'Chip Register Calculator'
}

applyDocumentLocale(locale.value)

watch(locale, (l) => {
  try { localStorage.setItem(STORAGE_KEY, l) } catch { /* ignore */ }
  applyDocumentLocale(l)
})

export function setLocale(l: Locale) {
  locale.value = l
}

/** Translate a key; `{name}` placeholders are replaced from params. Reactive when used in templates/computeds. */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const msg: string = messages[locale.value][key] ?? messages.zh[key] ?? key
  if (!params) return msg
  return msg.replace(/\{(\w+)\}/g, (m, p) => (p in params ? String(params[p]) : m))
}

export function useI18n() {
  return { t, locale, setLocale, LOCALES }
}
