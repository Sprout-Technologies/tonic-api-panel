// 默认Prompt
const general_prompt = 'realistic, photorealistic, 4k, uhd, ultra detail, sharp detail, POV photo,'

const feature_extractor = {
  'lineart_realistic_prompt': {
    'control_mode': 1,
    'module': 'lineart_realistic',
    'model': 'control_v11p_sd15_lineart [43d4be0d]'
  },
  'lineart_standard_prompt': {
    'control_mode': 1, 'module': 'lineart_standard',
    'model': 'control_v11p_sd15_lineart [43d4be0d]'
  },
  'lineart_realistic': {
    'module': 'lineart_realistic',
    'model': 'control_v11p_sd15_lineart [43d4be0d]'
  },
  'lineart_coarse': { 'module': 'lineart_coarse', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
  'lineart': { 'module': 'lineart', 'model': 'control_v11p_sd15_lineart [43d4be0d]' },
  'lineart_anime': { 'module': 'lineart_anime', 'model': 'control_v11p_sd15s2_lineart_anime [3825e83e]' },
  'softedge_hedsafe': { 'module': 'softedge_hedsafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
  'softedge_hed': { 'module': 'softedge_hed', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
  'softedge_pidinet': { 'module': 'softedge_pidinet', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
  'softedge_pidisafe': { 'module': 'softedge_pidisafe', 'model': 'control_v11p_sd15_softedge [a8575a2a]' },
  'depth_zoe': { 'module': 'depth_zoe', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
  'depth_midas': { 'module': 'depth_midas', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
  'depth_leres': { 'module': 'depth_leres', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
  'depth_leres++': { 'module': 'depth_leres++', 'model': 'control_v11f1p_sd15_depth [cfd03158]' },
  'canny': { 'module': 'canny', 'model': 'control_v11p_sd15_canny [d14c016b]' },
  'normal_bae': { 'module': 'normal_bae', 'model': 'control_v11p_sd15_normalbae [316696f1]' },
  'segmentation': { 'module': 'segmentation', 'model': 'control_v11p_sd15_seg [e1f51eb9]' },
  't2ia_sketch_pidi': { 'module': 't2ia_sketch_pidi', 'model': 't2iadapter_sketch_sd15v2 [f5789421]' }
}
const inpaint = {
  'lama': { 'module': 'inpaint_only+lama', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
  'inpaint_only': { 'module': 'inpaint_only', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
  'global': { 'module': 'inpaint', 'control_mode': 0, 'model': 'control_v11p_sd15_inpaint [ebff9138]' },
  'global_prompt': { 'module': 'inpaint', 'control_mode': 1, 'model': 'control_v11p_sd15_inpaint [ebff9138]' }

}
const stylers = {
  't2ia_style_clipvision': { 'module': 't2ia_style_clipvision', 'model': 't2iadapter_style_sd14v1 [202e85cc]' },
  'shuffle': {
    'module': 'shuffle',
    'model': 'control_v11e_sd15_shuffle [526bfdae]',
    'weight': 1.0,
    'start': 0.0,
    'end': 1
  },
  'shuffle_weight15': {
    'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 0.15, 'start': 0.0,
    'end': 1
  },
  'shuffle_mode2': {
    'module': 'shuffle', 'model': 'control_v11e_sd15_shuffle [526bfdae]', 'weight': 1.0, 'start': 0.0,
    'end': 1, 'control_mode': 2
  }
}

const tile = {
  'tile_resample': {
    'module': 'tile_resample',
    'control_mode': 0,
    'model': 'control_v11f1e_sd15_tile [a371b31b]',
    'weight': 0.5
  },
  'tile_colorfix': {
    'module': 'tile_colorfix',
    'control_mode': 0,
    'model': 'control_v11f1e_sd15_tile [a371b31b]',
    'weight': 0.5
  },
  'tile_colorfix+sharp': {
    'module': 'tile_colorfix+sharp',
    'control_mode': 0,
    'model': 'control_v11f1e_sd15_tile [a371b31b]',
    'weight': 0.5
  }
}

const base_models = {
  'cetusMix': 'general\\cetusMix_v4.safetensors [b42b09ff12]',
  'dreamshaper': 'general\\dreamshaper_4BakedVae.safetensors [5d18b5b494]',
  'revAnimated': 'general\\revAnimated_v122.safetensors [ea1a6218f7]',
  'deliberate': 'general\\deliberate_v2.safetensors [f0406fe1d4]',
  'rundiffusionFX': 'general\\rundiffusionFX_v10.safetensors [ad1a10552b]',
  'rundiffusionFX25D': 'general\\rundiffusionFX25D_v10.safetensors [ad1a10552b]',
  'meinaPastelInpaint': 'general\\meinapastel_v6-inpainting.safetensors',
  'revAnimatedInpaint': 'general\\revAnimated_v121Inp-inpainting.safetensors',
  'dreamShaperInpaint': 'general\\dreamshaper_8Inpainting.safetensors',
  'meinaUnrealInpaint': 'general\\meinaunreal_v41-inpainting.safeFtensors',
  'meinaMixInpaint': 'general\\meinamix_v11-inpainting.safetensors'
}
const styles = {
  'golden1': {
    'file': 'golden/t.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'add_detail': -0.4,
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden2': {
    'file': 'golden/95da916f6c2548908bab3b2c4a35b5ea.png',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'add_detail': -0.4,
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden3': {
    'file': 'golden/contra.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': -0.4,
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden4': {
    'file': 'golden/overdose.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden5': {
    'file': 'golden/y2k.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden6': {
    'file': 'golden/amongus.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden7': {
    'file': 'golden/clay.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden8': {
    'file': 'golden/eea.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden9': {
    'file': 'golden/harry.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden10': {
    'file': 'golden/hulk.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden11': {
    'file': 'golden/iron man.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'golden12': {
    'file': 'golden/starwar.jpg',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix'],
    'brightness': 1.1
  },
  'glass': {
    'file': 'glass/1.png',
    'control_color': false,
    'control_style': false,
    'approach': 'i2i',
    'cfg': 5,
    'denoising_strength': 0.5,
    'extractor': feature_extractor['softedge_hed'],
    'adetailer': false,
    'tile': tile['tile_resample'],
    'ref_only': true,
    'trigger_prompt': ',stained glass,<lora:st41nedg5CIVIT:1>',
    'tag_prompt': true,
    'neg_prompt': 'bad quality'
  },
  's1': {
    'file': 's/1.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  's2': {
    'file': 's/2.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  's3': {
    'file': 's/3.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  's4': {
    'file': 's/4.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  's5': {
    'file': 's/5.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  's6': {
    'file': 's/6.png',
    'control_color': true,
    'control_style': true,
    'extractor': feature_extractor['softedge_pidinet'],
    'openpose': false,
    'base_model': base_models['cetusMix'],
    'trigger_prompt': 'anime,'
  },
  'RAND#': {
    'file': 'RAND#',
    'control_color': false,
    'base_model': base_models['deliberate']
  },

  'Vincent Van Gogh': {
    'file': 'van gogh/1.png',
    'control_color': false,
    'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_realistic'] },
    'control_style': true,
    'sampler': 'DPM++ 2M Karras',
    'denoising_strength': 0.75,
    'trigger_prompt': 'vincent van gogh \(style\),multicolored background, colorful, the starry night,',
    'styler': stylers['shuffle'],
    'approach': 'i2i',
    'base_model': base_models['deliberate']
  },

  'lalala1': {
    'file': 'lalala/1.png',
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'brightness': Math.random() * (1.2 - 1) + 1,
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix']
  },
  // 以随机数生成
  'Lalala_anime1': {
    'file': 'Lalala/1.png',
    'control_color': true,
    'extractor': 'lineart_realistic',
    'brightness': 1.1,
    'contrast': 1.1,
    'add_detail': -0.5,
    'base_model': 'cetusMix'
  },
  // 以随机数生成
  'Lose It All_1': {
    'file': 'Lose It All/1.png',
    'control_color': true,
    'extractor': 'lineart_realistic',
    'styler': 'shuffle',
    'base_model': 'deliberate'
  }
}
for (let i = 1; i < 8; i++) {
  styles['Lalala_anime' + i] = {
    'file': `Lalala/${i}.png`,
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'brightness': Math.random() * (1.2 - 1) + 1,
    'contrast': Math.random() * (1.2 - 1) + 1,
    'add_detail': Math.random() * (0 - (-1)) + (-1),
    'base_model': base_models['cetusMix']
  }
}

for (let i = 1; i < 4; i++) {
  styles['Lose It All_' + i] = {
    'file': `Lose It All/${i}.png`,
    'control_color': true,
    'extractor': feature_extractor['lineart_realistic'],
    'styler': stylers['shuffle'],
    'base_model': base_models['deliberate']
  }
}

const WATERCOLOR_ORANGE_PINK = {
  'file': 'Watercolor/orange_pink.png',
  'control_color': true,
  'control_style': true,
  'add_detail': -0.4,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const WATERCOLOR_GREEN = {
  'file': 'Watercolor/green.png',
  'control_color': true,
  'control_style': true,
  'add_detail': -0.4,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const TENG = {
  'control_color': true,
  'control_style': false,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': '(style of Sachin Teng:1.6)' + ', 4k, uhd, ultra detail, sharp detail, POV photo,',
  'tag_prompt': true,
  'neg_prompt': '((1boy)), ((male_focus)), mexican, man',
  'base_model': base_models['deliberate']
}

const TENG_S1 = {
  'file': 's/1.png',
  'control_color': true,
  'control_style': false,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': '(style of Sachin Teng:1.6)' + ', 4k, uhd, ultra detail, sharp detail, POV photo,',
  'tag_prompt': true,
  'neg_prompt': '((1boy)), ((male_focus)), mexican, man',
  'base_model': base_models['deliberate']
}

const TENG_S2 = {
  'file': 's/2.png',
  'control_color': true,
  'control_style': false,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': '(style of Sachin Teng:1.6)' + ', 4k, uhd, ultra detail, sharp detail, POV photo,',
  'tag_prompt': true,
  'neg_prompt': '((1boy)), ((male_focus)), mexican, man',
  'base_model': base_models['deliberate']
}
const RANDOM_PROMPT = {
  'extractor': inpaint['lama'],
  'random_prompt': DEFAULT_RANDOM_PROMPT,
  'tag_prompt': true,
  'remove_character_prompt': true,
  'adetailer': false,
  'add_detail': 0.3,
  'neg_prompt': 'camera, hole, watermark, mirror, ((frame)), bar, ((framed)), font, ((word)), text, flower, trademark, human, body, arm, leg, feet, knee, head, ',
  'cfg': 10,
  'step': 50
}

const TOMORROW_WORD = {
  'mask': 'mask/tomorrow.png',
  'extractor': feature_extractor['lineart_realistic']
}

const TENG_S3 = {
  'file': 's/3.png',
  'control_color': true,
  'control_style': false,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': '(style of Sachin Teng:1.6)' + ', 4k, uhd, ultra detail, sharp detail, POV photo,',
  'tag_prompt': true,
  'neg_prompt': '((1boy)), ((male_focus)), mexican, man',
  'base_model': base_models['deliberate']
}

const TENG_S4 = {
  'file': 's/4.png',
  'control_color': true,
  'control_style': false,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': '(style of Sachin Teng:1.6)' + ', 4k, uhd, ultra detail, sharp detail, POV photo,',
  'tag_prompt': true,
  'neg_prompt': '((1boy)), ((male_focus)), mexican, man',
  'base_model': base_models['deliberate']
}

const NEON = {
  'file': 'neon/1.png',
  'control_style': true,
  'control_color': false,
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': '(neon:1.3), lineart, (neon lights:1.3), ',
  'base_model': base_models['dreamshaper'],
  'tag_prompt': true,
  'styler': stylers['t2ia_style_clipvision']
}
const EMPTY = {
  'control_style': true,
  'control_color': true,
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'tag_prompt': true,
  'step': 50,
  'cfg': 12,
  'add_detail': 0.8,
  'noise_offset': 0.3
}

const ANIME = {
  'file': 'golden/t.jpg',
  'control_color': true,
  'extractor': feature_extractor['lineart_realistic'],
  'add_detail': -0.4,
  'base_model': base_models['cetusMix']
}

const LIGHTS1 = {
  'file': 'Lights/1.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const LIGHTS2 = {
  'file': 'Lights/2.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}
const LIGHTS3 = {
  'file': 'Lights/3.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const LIGHTS4 = {
  'file': 'Lights/4.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const LIGHTS5 = {
  'file': 'Lights/5.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}
const IFLY1 = {
  'file': 'IFLY/1.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const IFLY2 = {
  'file': 'IFLY/2.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const IFLY3 = {
  'file': 'IFLY/3.png',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const IKNOW1 = WATERCOLOR_ORANGE_PINK

const IKNOW2 = {
  'file': 'I Know/2.png',
  'control_color': true,
  'control_style': true,
  'add_detail': -0.4,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const IKNOW3 = {
  'file': 'I Know/3.png',
  'control_color': true,
  'control_style': true,
  'add_detail': -0.4,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const IKNOW4 = {
  'file': 'I Know/4.png',
  'control_color': true,
  'control_style': true,
  'add_detail': -0.4,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}
const PSYCHEDELIC = {
  'file': 'Psychedelic/1.png',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 3,
  'denoising_strength': 0.75,
  'extractor': feature_extractor['lineart_realistic'],
  'styler': stylers['shuffle'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': '(masterpiece, best quality), psychedelic, multicolored background, colorful, ',
  'base_model': base_models['cetusMix'],
  'neg_prompt': 'bad anatomy, '
}

const VALORANT = {
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 3,
  'denoising_strength': 0.75,
  'extractor': feature_extractor['lineart_realistic'],
  'styler': stylers['shuffle_weight15'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'valorant, killjoy (valorant), valorant style, glasses, eyewear , simple background, green beanie, <lora:killjoy-nvwls-v1:1>  <lora:bichu-v0612:0.65>',
  'base_model': base_models['cetusMix'],
  'neg_prompt': 'words, fonts, '
}

const METALLIC = {
  'file': 'Metallic/1.jpg',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 3,
  'denoising_strength': 0.75,
  'styler': stylers['shuffle'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'base_model': base_models['cetusMix']
}

const LIQUID = {
  'file': 'Liquid/1.jpg',
  'control_color': true,
  'control_style': true,
  'extractor': feature_extractor['lineart_realistic'],
  'trigger_prompt': general_prompt,
  'base_model': base_models['deliberate'],
  'styler': stylers['t2ia_style_clipvision']
}

const POP1 = {
  'file': 'pop/1.png',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 3,
  'denoising_strength': 0.75,
  'extractor': feature_extractor['softedge_hed'],
  'styler': stylers['shuffle_mode2'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'multicolored background, pop art, backlighting,',
  'base_model': base_models['cetusMix'],
  'neg_prompt': 'words, fonts, '
}

const POP2 = {
  'file': 'pop/2.png',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 3,
  'denoising_strength': 0.75,
  'extractor': feature_extractor['softedge_hed'],
  'styler': stylers['shuffle_mode2'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'multicolored background, pop art, backlighting,',
  'base_model': base_models['cetusMix'],
  'neg_prompt': 'words, fonts, '
}

const STAMPS1 = {
  'file': 'stamps/1.jpg',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'styler': stylers['shuffle'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'base_model': base_models['cetusMix'],
  'adetailer': false
}
const STAMPS2 = {
  'file': 'stamps/2.jpg',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'styler': stylers['shuffle'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'base_model': base_models['cetusMix'],
  'adetailer': false
}

const STAMPS3 = {
  'file': 'stamps/3.png',
  'control_color': false,
  'control_style': true,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'styler': stylers['shuffle'],
  'openpose': { 'control_mode': 2, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'base_model': base_models['cetusMix'],
  'adetailer': false
}

const LEGO = {
  'control_color': false,
  'control_style': false,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'openpose': { 'control_mode': 0, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'LEGO Creator, LEGO BrickHeadz <lora:lego_v2.0:1>',
  'base_model': base_models['cetusMix'],
  'neg_prompt': 'bad id, bad quality, '
}

const BARBIE = {
  'control_color': false,
  'control_style': false,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'openpose': { 'control_mode': 0, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'BarbieCore, pink and white,  <lora:BarbieCore:1>',
  'base_model': base_models['dreamshaper'],
  'neg_prompt': 'bad id, bad quality, '
}
const ARCANE = {
  'control_color': false,
  'control_style': false,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'openpose': { 'control_mode': 0, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'arcane style,  <lora:arcane_offset:1>',
  'base_model': base_models['dreamshaper'],
  'neg_prompt': 'bad id, bad quality, '
}

const MARBLE = {
  'control_color': false,
  'control_style': false,
  'approach': 'i2i',
  'cfg': 7,
  'denoising_strength': 0.75,
  'openpose': { 'control_mode': 0, 'fallback_extractor': feature_extractor['lineart_standard_prompt'] },
  'trigger_prompt': 'M4rbleSCNEW,  <lora:M4rbleSCNEWCIVIT:1>',
  'adetailer': false,
  'base_model': base_models['cetusMix']
}
