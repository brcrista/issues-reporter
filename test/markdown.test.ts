import * as markdown from '../src/markdown';
import type { Section } from '../src/types';

describe('The details section', () => {
    test('is empty when there are no sections', () => {
        const details = Array.from(markdown.generateDetails([], { owner: 'test', repo: 'repo' }));

        expect(details).toStrictEqual(['## Details']);
    });

    test('has an empty table when there are no issues', () => {
        const sections: Section[] = [{
            section: "Empty section",
            labels: [],
            threshold: 1,
            issues: [],
            status: '💚🥳'
        }];

        const details = Array.from(markdown.generateDetails(sections, { owner: 'test', repo: 'repo' }));

        expect(details).toStrictEqual([
            '## Details',
            '### 💚🥳 Empty section [(query)](https://github.com/test/repo/issues?q=is%3Aissue+is%3Aopen)',
            'Total: 0\n',
            'Threshold: 1\n',
            'Labels: \n',
            '| Owner | Count |',
            '| -- | -- |'
        ]);
    });
});