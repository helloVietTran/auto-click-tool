const { chromium } = require('playwright');

const linkStr = `
  https://chat.whatsapp.com/B6fsOuIkXioCB9P44rHeXc
  https://chat.whatsapp.com/B8wm6wErTkm6U4W2mxbfj5
  https://chat.whatsapp.com/BBdVMWVkDbN0g4BUFZblEo
  https://chat.whatsapp.com/BcYsx3CB4UD66alp7LFyvS
  https://chat.whatsapp.com/BGAxswzYfbSJe68Xy2r6tb
  https://chat.whatsapp.com/BggevCewdfG6S41QI5Ysa1
  https://chat.whatsapp.com/BiuchNCZvb6HG4VaKLKleG
  https://chat.whatsapp.com/BnDkPP677WS1fmtNWQkh93
  https://chat.whatsapp.com/BO6lKABpiui5Tvvhtku6ai
  https://chat.whatsapp.com/BuEcbWJXWKhGE92fw5DCkw
  https://chat.whatsapp.com/BUGFnmpkPZFIYN7YLOZ5uz
  https://chat.whatsapp.com/BxNldu3vftl77Por2Cuo5c
  https://chat.whatsapp.com/CadQVcIRpKOH4mNzTaKT0v
  https://chat.whatsapp.com/CBLdOqoE8gU28MiK3nLcks
  https://chat.whatsapp.com/CbzRgJrkjLPDkysB7y5Tmf
  https://chat.whatsapp.com/CdzepSJ4bmsBNCn9gh5ncV
  https://chat.whatsapp.com/CEJsLFzbLBcIA4qQVEuvf5
  https://chat.whatsapp.com/CfosGNLUwzo7MnsvjXUAu2
  https://chat.whatsapp.com/CgLD9RU2KfiKF8Cu8alhpc
  https://chat.whatsapp.com/CHoHp42Pks6ITHGskElu8j
  https://chat.whatsapp.com/CnkxwK52bhjI8OLjgUq0pG
  https://chat.whatsapp.com/Cr9KNJenoRL36djCTyQuNt
  https://chat.whatsapp.com/CRAR5Pfl62r2WamcxJusdx
  https://chat.whatsapp.com/CtgHPCeGRAO1StYKVNNGSu
  https://chat.whatsapp.com/CTopAPJAw9jGcCpQvJ6tSl
  https://chat.whatsapp.com/CVfleOpPpbFFZyeJzuMIXc
  https://chat.whatsapp.com/CwLolnlyhxcCnCu08hWMh5
  https://chat.whatsapp.com/CycLKmM68le6PlYtoR6dVC
  https://chat.whatsapp.com/CYXyKh5iEt5KSXMEZzuaDO
  https://chat.whatsapp.com/D19sSEYYRhy1cTl5GLcBBj
  https://chat.whatsapp.com/D25u4A0Bqit9BrHWY6ESAU
  https://chat.whatsapp.com/D9k2ngVB7Ph0AzS5uao83x
  https://chat.whatsapp.com/DbG5A4jIpR1EzvUzJWHzo5
  https://chat.whatsapp.com/Ddw2Ra0YQQv2JhMkLSt61n
  https://chat.whatsapp.com/DErA4StB566LmdLpdBB7Ga
  https://chat.whatsapp.com/DFCPlRKXp3HELJALI6UAKZ
  https://chat.whatsapp.com/DHa7zyvar2PGP7eYlCm4T5
  https://chat.whatsapp.com/DKnePPFZbMBBQEuF4cWLUv
  https://chat.whatsapp.com/Dl5PGvNcCad2Fult9m6xx0
  https://chat.whatsapp.com/DMQBvTfGU4iBza2BV8EJE7
  https://chat.whatsapp.com/DN32MP6AGM8A7tZgmGbxji
  https://chat.whatsapp.com/Dn86IxAgp3lKpYC0coa0Zo
  https://chat.whatsapp.com/DOUjkfUgdJJ5rp2h4ne0Hb
  https://chat.whatsapp.com/DrVJFXBP3KkELeKzNwJ6zc
  https://chat.whatsapp.com/DsvOLh66qsvLSjR8ML9c0t
  https://chat.whatsapp.com/DVf7yrzKEqqFjwTdKzBs0T
  https://chat.whatsapp.com/DXxUrp6b4gK9s9iPRC34Ei
  https://chat.whatsapp.com/Dz2D43EV8Cx54lBnYbR343
  https://chat.whatsapp.com/DZIiaiAYiQf4E1nqfK9Bck
  https://chat.whatsapp.com/E1QK61EPaYJ2gdK5XeS2au
  https://chat.whatsapp.com/EaE9q6GHv1I6vQozLbePkH
  https://chat.whatsapp.com/Eaigo5AkuHVDmkuAkdxcoz
  https://chat.whatsapp.com/EAZdznH6QhH9O0bTbmNgOm
  https://chat.whatsapp.com/EDkmh2nBiWZ2aN6ITLi6tG
  https://chat.whatsapp.com/EfobfSv6YEW1HTvbyo7cWL
  https://chat.whatsapp.com/EHCoyJNc55b1XDTcQ6SwXP
  https://chat.whatsapp.com/Ehjj6nqZqFp3oTiuVUPhj7
  https://chat.whatsapp.com/Ejz74PJwL1ZIZcRve2FQKa
  https://chat.whatsapp.com/EmKar9vnkK3KdPjT99vzpM
  https://chat.whatsapp.com/Eou9ks8fbgSKKffbDUlikw
  https://chat.whatsapp.com/EqfGTnwBYiE7SGWawZsnvD
  https://chat.whatsapp.com/ERh9j5GyaYNK2He4KKEO8u
  https://chat.whatsapp.com/Ewo2qhECY0JA9CELTgejdQ
  https://chat.whatsapp.com/EwUWgoWginMFxCp9ljLTHt
  https://chat.whatsapp.com/EwvJltCjhRyHABbNFl9rQD
  https://chat.whatsapp.com/F1fCMEcIZAM6ijjrl9QVBS
  https://chat.whatsapp.com/F6yhmRezuOmGLm6stfoxSO
  https://chat.whatsapp.com/F8fN0PRp9nw1LAlS36Ri3Y
  https://chat.whatsapp.com/FAG9KhP1ISGLRnFFNknY09
  https://chat.whatsapp.com/FC6QzhH33OgHmswZ5cJpYS
  https://chat.whatsapp.com/FCwVdwaRYLeLvaR4N4jQvb
  https://chat.whatsapp.com/FEkEjg5enRiE4tudJwP506
  https://chat.whatsapp.com/FF1mzaBo35PEuBUTJ1dQl1
  https://chat.whatsapp.com/Ffm7WpwUG4711zvA3XrZjR
  https://chat.whatsapp.com/FghOjpLj8HNKOSxYqRSVuH
  https://chat.whatsapp.com/FGzIupAL9lGJ3OkPnx50am
  https://chat.whatsapp.com/FInBf03338t92Qv3URoMRd
  https://chat.whatsapp.com/FkmeoOXzJxmFKEr0ySGcmM
  https://chat.whatsapp.com/Fl1Pez4s6L9Kzm4QfzNOHl
  https://chat.whatsapp.com/Fnt4TLImb8J2E5Jcrhreav
  https://chat.whatsapp.com/FOjUZasAMRsDi1Rv2J3TWB
  https://chat.whatsapp.com/FPc73BZQBFHAIPLfAtkWfj
  https://chat.whatsapp.com/FPVge7oJa7fLvezK3KbcXg
  https://chat.whatsapp.com/FQehvsJsBhDL29s04s3HQB
  https://chat.whatsapp.com/FWim7xAj0TXAsrFKDyRMDM
  https://chat.whatsapp.com/FxBX1I6Io7s3orXkDvgSAv
  https://chat.whatsapp.com/FXrhr0NsJlsI1nBPo2lUP6
  https://chat.whatsapp.com/FytF4AqWoG9LIcyUnr8Nrr
  https://chat.whatsapp.com/Fz0gvDS9a7m6FsRLz5diDD
  https://chat.whatsapp.com/Fz2850TfQKa45kEnUqKrGH
  https://chat.whatsapp.com/FZpuvjlm8LHCnmYvEOlRx6
  https://chat.whatsapp.com/G52V7phtK0C2bKkTIOeTxS
  https://chat.whatsapp.com/G7UZEahJ2NGLlyvNiEMGiw
  https://chat.whatsapp.com/GBW5uZ4S6luBJzXyOjW9eB
  https://chat.whatsapp.com/GcMp9r5gs5U9QUUg8LkLhv
  https://chat.whatsapp.com/GEqSjGwSNJG6RFtks1HXKI
  https://chat.whatsapp.com/GFTEjIYfZhq11Wz2uZF14w
  https://chat.whatsapp.com/GGAEcehP7TYKZLaKB9lC7H
  https://chat.whatsapp.com/GkATJ647cvTDtzBBpeVGoD
  https://chat.whatsapp.com/GLYPV7ieSrbACQC6mtjoMx
  https://chat.whatsapp.com/GQLreEpw3cQ7HtuFSD2sYE
  https://chat.whatsapp.com/GRT7teZzVVS5xXmhbm3ruv
  https://chat.whatsapp.com/GvL7gpb15h2IU6yk4B93Fr
  https://chat.whatsapp.com/GVxmHxznRaUJY4RpIRcktx
  https://chat.whatsapp.com/GVZmVOwpeJABXAnEsTDmNQ
  https://chat.whatsapp.com/Gz3kGCzEnUOCCin2eqBIay
  https://chat.whatsapp.com/GZ57ag54T9PESgXA2EQxKR
  https://chat.whatsapp.com/H6oVgziKjhYLGEPyiXhsrg
  https://chat.whatsapp.com/H7bENm9ObwiGR37sEa4ovW
  https://chat.whatsapp.com/H86fanH39ms2EFiFK5WDXc
  https://chat.whatsapp.com/H8WOgSN4J8P1k49bIOA9Xt
  https://chat.whatsapp.com/HgFAjh9u21KAWlhfeNsrsC
  https://chat.whatsapp.com/Hgp9QzrcGOLK5waXgLJrBU
  https://chat.whatsapp.com/HkcNsmAyrqYLKv7p3hNoGZ
  https://chat.whatsapp.com/Ho5q3zGX7ZF4xFIocb4XN0
  https://chat.whatsapp.com/HpK3WAm18cB3mIDpwZedJ3
  https://chat.whatsapp.com/HQ5sy8ODiTu6qzGkTDuQjT
  https://chat.whatsapp.com/HQkZkbqMn6c1VkLxSBEEan
  https://chat.whatsapp.com/Hs9Ptwk86me3YssR24xvgq
  https://chat.whatsapp.com/HU43Akhhevd82xRoJjPOAX
  https://chat.whatsapp.com/HUWigoXkkj71W4o70L0vsi
  https://chat.whatsapp.com/Hx9VIvdgBUB465HomaeI2V
  https://chat.whatsapp.com/HyufgNliU7kAJQx6o4KxCP
  https://chat.whatsapp.com/I1mTJEcOz75HNzclrti1B6
  https://chat.whatsapp.com/I4Cyxjd3WTT9IzVL5helYX
  https://chat.whatsapp.com/I6BTuhR2JMoCbTNb9TlloD
  https://chat.whatsapp.com/I6mNM0wbUXJHND2MvdtboQ
  https://chat.whatsapp.com/IbjBqYWiZRh8mhcr5pfpmM
  https://chat.whatsapp.com/IBxHEluolLqFkBYhtpt0jd
  https://chat.whatsapp.com/IDmrfDR80MR0FAatyGCsGF
  https://chat.whatsapp.com/IeB1Cbd4jL98vHZA0E88kj
  https://chat.whatsapp.com/IFVAJuwHDlfAt2FiQLMGhG
  https://chat.whatsapp.com/IGEFRJta0pCDP1RSEIFJfl
  https://chat.whatsapp.com/IggzpxTt2EI7vGdEPHrLUn
  https://chat.whatsapp.com/IJZi6fNQlKm7N7TELYRYbH
  https://chat.whatsapp.com/Ims3SQaj95eBfIkeeDXGHR
  https://chat.whatsapp.com/IOgQLC4pm2T0WuGg2cTfMz
  https://chat.whatsapp.com/ItwcFY0ijfH2utn5keepO0
  https://chat.whatsapp.com/IVGyQ9jgmui5RKRnyd4TJE
  https://chat.whatsapp.com/IW6A04dvuhA0MC97RLsT9e
  https://chat.whatsapp.com/IXD0ljzVsEe5tEQm6hPySS
  https://chat.whatsapp.com/Jb06mgMRrxYFfrrI1xmDaw
  https://chat.whatsapp.com/JCbLEM83KaR9CSn802JaJC
  https://chat.whatsapp.com/JCIoXstgmTAIAYbz7ojLGY
  https://chat.whatsapp.com/JcYYuJR7Nf1Fl0Hl3izKEt
  https://chat.whatsapp.com/JdiDniBXApS3FFLUCfGRCi
  https://chat.whatsapp.com/JDlgQzPj9Vd9sfBHaR7JGJ
  https://chat.whatsapp.com/JfArWkQvRfw6dWGLyxqWog
  https://chat.whatsapp.com/JGBC3FW48S102yrXIMTtqV
  https://chat.whatsapp.com/JNX4iVsltXgJ7DXgg3u3Cz
  https://chat.whatsapp.com/JoKAXMP8TJ8KtinfvbvQNc
  https://chat.whatsapp.com/JP8rzZ62aUfEFq0nWZudzG
  https://chat.whatsapp.com/JpKICeX0XScKwaSj0p7Xqa
  https://chat.whatsapp.com/JPw923gutkDCxKHFJeBs2l
  https://chat.whatsapp.com/Jr33ahV7SNY6SRcu0uMuk4
  https://chat.whatsapp.com/JsUo9yFpR3w0V9nKp1NuDe
  https://chat.whatsapp.com/JtFP0fE215aGEnzbGagNHL
  https://chat.whatsapp.com/JVmgMTjz2yL9MDzoDVdJeC
  https://chat.whatsapp.com/JyrwVkLjLUR8FArqIS5MSK
  https://chat.whatsapp.com/Kg8C5GkUS9hHlMl43zPqHR
  https://chat.whatsapp.com/KgTiDUMIEiyExxvHIcstge
  https://chat.whatsapp.com/KiRZZB3F0NRAucExnwGPQh
  https://chat.whatsapp.com/KmSNy8NaRScHMU4HPxjnBR
  https://chat.whatsapp.com/KNTjeaYLh91GvmuzgifpN2
  https://chat.whatsapp.com/KPP7YCVCZXSHbKpKK9rX8c
  https://chat.whatsapp.com/KS2wItUMjdV9LwzaNF1Ia0
  https://chat.whatsapp.com/KS4zvjzF3D5LIBnh58wEEj
  https://chat.whatsapp.com/KSjNh0sRGZa5egOQsDyXbD
  https://chat.whatsapp.com/KSTrgmwp93a7zQbjrMSi56
  https://chat.whatsapp.com/KtJeIFBPCDYC7bWTEUiW7d
  https://chat.whatsapp.com/Kwnf2SOCn2x1CJaAEYokXb
  https://chat.whatsapp.com/KXBfrIUEilsHITbbokMz0z
  https://chat.whatsapp.com/Kz9thudto708Ang5O4uuwU
  https://chat.whatsapp.com/L0XQV80HoT2It5kskqRpcd
  https://chat.whatsapp.com/L9NOMVYzJNw5CFvhAVv4c8
  https://chat.whatsapp.com/LfNLfv6hlbKDGPMl19EJ2l
  https://chat.whatsapp.com/LHSLmTfB1RuGw2ihfgdWaH
  https://chat.whatsapp.com/LIkAL1ZOIam1kKN7a9RhWM
  https://chat.whatsapp.com/LjtZngdb80UHLx7CP0lMGE
  https://chat.whatsapp.com/LJu5AorKBjmGPkO1Xtf0Ix
  https://chat.whatsapp.com/Lkjdh56TwP0767hdWFFbQM
  https://chat.whatsapp.com/LKUPGc0tN6Z0ra2mnWtfGa
  https://chat.whatsapp.com/LNJR7io7oxrAFovhqSOgDa
  https://chat.whatsapp.com/LobEmel7VNy3sWiOIW3RaY
  https://chat.whatsapp.com/Lp2S87IorCj7au4yCsv3S1
  https://chat.whatsapp.com/LpI7me3yP5ED7NXhcpFtl5
  https://chat.whatsapp.com/LRQ1hnRYlbU4ydSbfxExHq
  https://chat.whatsapp.com/LV7tfybGZPtJ5hHDPCi7Bd
  https://chat.whatsapp.com/LYR9m7jBTBgHMB3bnH2Nuk
  https://chat.whatsapp.com/LZ2cB3UDaF08ChTKqQRNu0
  https://chat.whatsapp.com/LZqAW9HZdXiGXIC555gO4t
  https://chat.whatsapp.com/K97hC6UQXhS3btzdNm7aVx?mode=ems_copy_c
  https://chat.whatsapp.com/CZRIP5olzAHDuDgQMfzJda?mode=ems_wa_t
  https://chat.whatsapp.com/L9BYLh7C7zIAUPAYaWJCAW?mode=ems_wa_c
  https://chat.whatsapp.com/JEX5yqM2ZnM4MYG57XBBLZ
  https://chat.whatsapp.com/Ehjj6nqZqFp3oTiuVUPhj7?mode=ems_wa_t
  https://chat.whatsapp.com/GpFa5qDWQAh8Jhmg3Ce9p9
  https://chat.whatsapp.com/FXxV3gSmXiw9yqxbpCYmRR
  https://chat.whatsapp.com/HtEB6yltdOTLEIGZYHaXxR
  https://chat.whatsapp.com/LU3SXYpAUc69KqsUzuO7Pq
  https://chat.whatsapp.com/CZRIP5olzAHDuDgQMfzJda?mode=ems_wa_t
  https://chat.whatsapp.com/F9OdmZPrd8k3NTdpM7hPTh?mode=wwt
  https://chat.whatsapp.com/D25u4A0Bqit9BrHWY6ESAU
  https://chat.whatsapp.com/GaXO8i85M33Ang9mlNLkJC?mode=ems_wa_t
  https://chat.whatsapp.com/ItEiys8caEf4MdTxhj7HvM?mode=wwc
  https://chat.whatsapp.com/G9THuThb20PAokRgIFWFiI?mode=ems_copy_t
  https://chat.whatsapp.com/CGRcxDTYDENHZjv6vk0O97?mode=wwc
  https://chat.whatsapp.com/GPghyTKv00hJR8ca5RvDJw
  https://chat.whatsapp.com/KS2wItUMjdV9LwzaNF1Ia0?mode=ems_wa_t
  https://chat.whatsapp.com/LRQ1hnRYlbU4ydSbfxExHq?mode=wwt
  https://chat.whatsapp.com/EKiH6W8ZNbGBeAGdXm74Mp?mode=hqrt3
  https://chat.whatsapp.com/CgnWOSGmY00FhiHbA2unFK
  https://chat.whatsapp.com/GPQG8Qi3OO67XYLbJ25ZD7?mode=wwt
  https://chat.whatsapp.com/FadnkJLVaZjHgisgKadmW5
  https://chat.whatsapp.com/KsR0BtAEagbLF6afnP7m5c
  https://chat.whatsapp.com/E48OfLVArNBDwOhHZEGwJg
  https://chat.whatsapp.com/Hx8WnQwlzqEJt4jnAfOCYQ?mode=wwt
  https://chat.whatsapp.com/E48OfLVArNBDwOhHZEGwJg
  https://chat.whatsapp.com/BbOTAcZnlX83PaXGyRs7pP?mode=wwt
  https://chat.whatsapp.com/B6dUqEPhswrHdmDR6dyslF?mode=wwt
  https://chat.whatsapp.com/GEtPqY8APjSFEqTMzLfOEa?mode=wwt
  https://chat.whatsapp.com/EDPqH5JtVjmJTBvZcqtjwW?mode=wwt
  https://chat.whatsapp.com/CL736sQpBkZFNIKVni0qbr
  https://chat.whatsapp.com/CMcZKYLgkkY0eOzcHs4H67?mode=wwt
  https://chat.whatsapp.com/HYqsSXSSa5uC17s2OwR0lR
  https://chat.whatsapp.com/EhW75mNh9iP3fKUcFpIkvC
  https://chat.whatsapp.com/HRJZkO7G3P58hoQiykEmyk
  https://chat.whatsapp.com/JkevgsNQCrR8XEXSObzONm
  https://chat.whatsapp.com/JCbLEM83KaR9CSn802JaJC?mode=wwt
  https://chat.whatsapp.com/EKiH6W8ZNbGBeAGdXm74Mp?mode=hqrt3
`;

function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .trim()
    .replace(/\s+/g, ' ');
}

;(async () => {
  const linkArrays = linkStr
    .split('\n')
    .map(link => link.trim())
    .filter(link => link !== '');
  
  const targetGroups = ["Germany 🇩🇪 Watch communication group", "Vintage dealer UAE 🇦🇪"];
  
  const normalizedTargets = targetGroups.map(group => normalizeString(group));
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    locale: 'en-US' 
  });

  
  for (const link of linkArrays) {
  
    const page = await context.newPage(); 
    
    try {
      await page.goto(link, { waitUntil: 'networkidle', timeout: 15000 });
      
      const groupTitleElement = page.locator('h3._9vd5._9scr');
      await groupTitleElement.waitFor({ state: 'visible', timeout: 4000 });
      
      const rawGroupTitle = await groupTitleElement.innerText();
      const normalizedCurrentTitle = normalizeString(rawGroupTitle);
      
      if (normalizedTargets.includes(normalizedCurrentTitle)) {
        console.log(`[Tìm thấy] Nhóm: "${rawGroupTitle.trim()}"`);
        console.log(`-> Link: ${link}`);
        console.log('--------------------------------------------');
      }
      
    } catch (error) {
      console.log(`[Bỏ qua] Link lỗi hoặc hết hạn: ${link} (${error.message.split('\n')[0]})`);
    } finally {
      if (page && !page.isClosed()) {
        await page.close();
      }
    }
  }
  
  await browser.close();
})();