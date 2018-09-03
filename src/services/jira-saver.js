export default {
	multiSave(timers) {
		timers = _.filter(timers, (t) => t.task && t.time > 0 && t.date && t.text);
		return Promise.all(_.map(timers, (t) => this.saveTime(t.task, t.time + 'm', t.date, t.text)));
	},

	/**
	 *
	 * @param task - CORE-1705
	 * @param time - minutes
	 * @param date - moment
	 * @param comment - string
	 * @return {Promise<any>}
	 */
	saveTime(task, time, date, comment) {
		return new Promise((resolve, reject) => {
			const data = {
				timeSpentSeconds: time * 60,
				comment: `<p>${comment}</p>`,
				started: date.toISOString()
			};

			$.ajax({
				type: 'POST',
				//url: 'https://5evenagency.atlassian.net/rest/internal/2/issue/CORE-1705/worklog?adjustEstimate=auto',
				url: `/rest/internal/2/issue/${task}/worklog?adjustEstimate=auto`,
				// {
				// "timeSpentSeconds":10800,
				// "comment":"<p>Добавил учёт настройки для выставления в подозрительные события.</p>",
				// "started":"2018-09-03T13:35:52.118+0500"
				// }
				data: JSON.stringify(data),
			})
				.done((r) => resolve(r))
				.fail((e) => reject(e));

			//$.ajax({url: `https://5evenagency.atlassian.net/browse/${task}`})
		// 	$.ajax({url: `/browse/${task}`})
		// 		.done((r) => {
		// 			let matches = r.match(/data-issue-key=.+rel="(\d+)"/);
		// 			let id = matches[1];
		//
		// 			matches = r.match(/<meta\s+id="atlassian-token"\s+name="atlassian-token"\s+content="([^"]+)">/);
		// 			let token = matches[1];
		//
		// 			let data = [
		// 				'inline=true',
		// 				'decorator=dialog',
		// 				`id=${id}`,
		// 				`timeLogged=${time}`,
		// 				`startDate=${date}`,
		// 				'adjustEstimate=auto',
		// 				`comment=${comment}`,
		// 				`atl_token=${token}`
		// 			];
		//
		// 			$.ajax({
		// 				type: 'POST',
		// 				url: '/secure/CreateWorklog.jspa',
		// 				//url: 'https://5evenagency.atlassian.net/secure/CreateWorklog.jspa',
		// 				data: data.join('&')
		// 			})
		// 				.done((r) => resolve(r))
		// 				.fail((e) => reject(e));
		// 		})
		// 		.fail((e) => reject(e));
		});

	}
}
