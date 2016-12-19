export default {
    multiSave(timers) {
        timers = _.filter(timers, (t) => t.task && t.time > 0 && t.date && t.text);
        return Promise.all(_.map(timers, (t) => this.saveTime(t.task, t.time + 'm', t.date, t.text)));
    },

    saveTime(task, time, date, comment) {
        return new Promise((resolve, reject) => {
            //$.ajax({url: `https://5evenagency.atlassian.net/browse/${task}`})
            $.ajax({url: `/browse/${task}`})
                .done((r) => {
                    let matches = r.match(/data-issue-key=.+rel="(\d+)"/);
                    let id = matches[1];

                    matches = r.match(/<meta\s+id="atlassian-token"\s+name="atlassian-token"\s+content="([^"]+)">/);
                    let token = matches[1];

                    let data = [
                        'inline=true',
                        'decorator=dialog',
                        `id=${id}`,
                        `timeLogged=${time}`,
                        `startDate=${date}`,
                        'adjustEstimate=auto',
                        `comment=${comment}`,
                        `atl_token=${token}`
                    ];

                    $.ajax({
                        type: 'POST',
                        url: '/secure/CreateWorklog.jspa',
                        //url: 'https://5evenagency.atlassian.net/secure/CreateWorklog.jspa',
                        data: data.join('&')
                    })
                        .done((r) => resolve(r))
                        .fail((e) => reject(e));
                })
                .fail((e) => reject(e));
        });

    }
}
