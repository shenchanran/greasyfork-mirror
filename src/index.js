import './bootstrap.min.css';
// 使用 fetch 获取 JSON 数据并解析
function sort(){
    let father = document.querySelector('#siteList')
    // 获取所有子元素
    const children = Array.from(father.children);
    // 对子元素根据 data-time 属性进行排序
    children.sort((a, b) => {
        const timeA = parseInt(a.getAttribute('data-time'), 10);
        const timeB = parseInt(b.getAttribute('data-time'), 10);
        return timeA - timeB;
    });
    // 清空父元素并重新附加已排序的子元素
    children.forEach(child => {
        father.appendChild(child);
    });
}
function siteTime(siteId){
    let now = new Date().getTime()
    let startTime = eval(`window.siteStartTime${siteId}`)
    let spendTime = now-startTime
    let cclass
    if(spendTime>2000){
        cclass = 'bg-danger'
    }else if(spendTime>1000){
        cclass = 'bg-warning'
    }else if(spendTime<=1000){
        cclass = 'bg-success'
    }
    let father = document.querySelector(`#site${siteId}`)
    father.dataset.time = spendTime
    let son = document.querySelector(`#siteTime${siteId}`)
    son.classList.remove('bg-danger')
    son.classList.add(cclass)
    son.innerHTML = `延迟 ${spendTime}ms`
    sort()
}
let time = new Date().getTime()
fetch(`sites.json?t=${time}`)  // 替换为你实际的 JSON 文件 URL
  .then(response => {
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    return response.json();  // 解析 JSON 数据
  })
  .then(data => {
    let info = data.info
    let sites = data.sites
    document.querySelector('#info').innerHTML = info
    let t = 0
    for(let i=0;i<sites.length;++i){
        let site = sites[i]
        let div = document.createElement('div')
        div.setAttribute('class','col-12')
        div.setAttribute('id',`site${site.siteId}`)
        div.dataset.time = "9999"
        div.innerHTML = `<div class="mirror-card p-4 bg-white shadow-sm mouse" onclick="location.href='#'">
                    <div class="row align-items-center">
                        <div class="col">
                            <h3 class="text-primary mb-0">${site.name}</h3>
                            <small class="text-muted">${site.url}</small>
                        </div>
                        <div class="col-auto">
                            <span class="badge bg-danger rounded-pill" id="siteTime${site.siteId}">无法访问</span>
                        </div>
                    </div>
                </div>`
        div.addEventListener('click',function(){
            location.href = site.url
        })
        document.querySelector('#siteList').appendChild(div)
        let s = document.createElement("script")
        s.src = site.scripturl+'?t='+time
        s.setAttribute('integrity',site.integrity)
        s.setAttribute('crossorigin','anonymous')
        let z = document.getElementsByTagName("script")[0]
        setTimeout(function(){
            z.parentNode.insertBefore(s, z)
            eval(`
                window.siteStartTime${site.siteId}=${new Date().getTime()};
                window.site${site.siteId}=function(){
                    siteTime(${site.siteId})
                }`)
        },t)
        t+=200
    }
  })
  .catch(error => {
    console.error('获取数据失败:', error);
  });

